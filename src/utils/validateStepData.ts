import { FieldType, type FormField, type FormStep } from '../types/formSchema';
import { CPF_REGEX, TELEFONE_REGEX, CEP_REGEX, EMAIL_REGEX, isValidCpfDigits } from './regexes';
import { evaluateFieldCondition } from './evaluateFieldCondition';

// ── Cache de RegExp compiladas ────────────────────────────────────────────────
const regexCache = new Map<string, RegExp | null>();
const getCompiledRegex = (pattern: string): RegExp | null => {
    if (regexCache.has(pattern)) return regexCache.get(pattern)!;
    if (/^\/.*\/[gimsuy]*$/.test(pattern)) {
        regexCache.set(pattern, null);
        return null;
    }
    try {
        const re = new RegExp(pattern);
        regexCache.set(pattern, re);
        return re;
    } catch {
        regexCache.set(pattern, null);
        return null;
    }
};

// ── Tipos públicos ────────────────────────────────────────────────────────────

export interface ValidacaoCampoErro {
    campo: string;
    label: string;
    message: string;
}

export interface ResultadoValidacaoStep {
    valid: boolean;
    errors: ValidacaoCampoErro[];
}

// ── validateField (interno) ───────────────────────────────────────────────────

const validateField = (
    field: FormField,
    rawValue: unknown,
    externalData: Record<string, unknown>,
): string | undefined => {
    const v = field.validacao;

    if (field.tipo === FieldType.CHECKBOX) {
        if (field.obrigatorio && !rawValue) return 'Campo obrigatório';
        return undefined;
    }

    if (field.tipo === FieldType.SWITCH) {
        if (field.obrigatorio && !rawValue) return 'Campo obrigatório';
        return undefined;
    }

    if (field.tipo === FieldType.SLIDER) {
        const num = (rawValue !== undefined && rawValue !== null && rawValue !== '') ? Number(rawValue) : NaN;
        if (field.obrigatorio && isNaN(num)) return 'Campo obrigatório';
        if (isNaN(num)) return undefined;
        if (v?.min !== undefined && num < v.min) return `Valor mínimo: ${v.min}`;
        if (v?.max !== undefined && num > v.max) return `Valor máximo: ${v.max}`;
        return undefined;
    }

    if (field.tipo === FieldType.RATING) {
        const num = rawValue !== undefined ? Number(rawValue) : 0;
        if (field.obrigatorio && (!num || num < 1)) return 'Avaliação obrigatória';
        return undefined;
    }

    if (field.tipo === FieldType.DATE_RANGE) {
        const val = rawValue as { start?: string; end?: string } | null | undefined;
        if (field.obrigatorio) {
            if (!val?.start) return 'Data inicial obrigatória';
            if (!val?.end) return 'Data final obrigatória';
        }
        if (val?.start && val?.end && val.start > val.end)
            return 'A data inicial deve ser menor ou igual à data final';
        return undefined;
    }

    if (field.tipo === FieldType.PARTICIPATION_TYPE) {
        if (!field.obrigatorio) return undefined;
        const val = rawValue as { tipo?: string; data?: string | null; genero?: string | null } | null | undefined;
        if (!val?.tipo) return 'Selecione o tipo de participação';
        if (val.tipo === 'por_dia' && !val.data) return 'Selecione um dia para participar';
        if ('genero' in (val ?? {}) && !val?.genero) return 'Selecione o sexo';
        return undefined;
    }

    if (field.tipo === FieldType.CHECKBOX_GROUP) {
        const arr = Array.isArray(rawValue) ? rawValue : [];
        if (field.obrigatorio && arr.length === 0) return 'Selecione pelo menos uma opção';
        return undefined;
    }

    if (field.tipo === FieldType.FILE) {
        // DB-check (upload pertence à inscrição) fica no backend.
        // Aqui apenas valida obrigatoriedade.
        if (field.obrigatorio && !rawValue) return 'Arquivo obrigatório';
        return undefined;
    }

    if (field.tipo === FieldType.TERMS) {
        if (field.obrigatorio && rawValue !== 'accepted')
            return 'Você precisa aceitar os termos para continuar';
        return undefined;
    }

    if (field.tipo === FieldType.NUMBER) {
        const str = rawValue !== undefined && rawValue !== null ? String(rawValue) : '';
        if (field.obrigatorio && !str) return 'Campo obrigatório';
        if (!str) return undefined;
        const num = Number(str);
        if (isNaN(num)) return 'Deve ser um número';
        if (v?.min !== undefined && num < v.min) return `Valor mínimo: ${v.min}`;
        if (v?.max !== undefined && num > v.max) return `Valor máximo: ${v.max}`;
        return undefined;
    }

    if (field.tipo === FieldType.SELECT || field.tipo === FieldType.AUTOCOMPLETE || field.tipo === FieldType.RADIO) {
        const str = rawValue !== undefined && rawValue !== null ? String(rawValue) : '';
        if (field.obrigatorio && !str) return 'Campo obrigatório';
        if (!str) return undefined;
        if (field.opcoes && field.opcoes.length > 0) {
            const allowed = field.opcoes.map((o) => String(o.valor));
            if (!allowed.includes(str)) return 'Opção inválida';
        }
        return undefined;
    }

    const str = rawValue !== undefined && rawValue !== null ? String(rawValue) : '';

    if (field.obrigatorio && !str.trim()) return 'Campo obrigatório';
    if (!str) return undefined;

    if (field.tipo === FieldType.EMAIL && !EMAIL_REGEX.test(str)) return 'E-mail inválido';
    if (field.tipo === FieldType.CPF) {
        if (!CPF_REGEX.test(str)) return 'CPF inválido';
        if (!isValidCpfDigits(str)) return 'CPF inválido';
    }
    if (field.tipo === FieldType.TELEFONE && !TELEFONE_REGEX.test(str)) return 'Telefone inválido';
    if (field.tipo === FieldType.CEP && !CEP_REGEX.test(str)) return 'CEP inválido';

    if (v?.minLength && str.length < v.minLength) return `Mínimo ${v.minLength} caracteres`;
    if (v?.maxLength && str.length > v.maxLength) return `Máximo ${v.maxLength} caracteres`;

    if ((field.tipo === FieldType.DATE || field.tipo === FieldType.DATETIME) && str) {
        if (v?.minDate && str < v.minDate) return `Data mínima: ${v.minDate}`;
        if (v?.maxDate && str > v.maxDate) return `Data máxima: ${v.maxDate}`;
    }

    if (
        (field.tipo === FieldType.DATE || field.tipo === FieldType.DATETIME) &&
        str &&
        (v?.minAge != null || v?.maxAge != null)
    ) {
        const datePart = str.split('T')[0];
        const birth = new Date(datePart + 'T00:00:00');
        const eventoDataStr = externalData['evento.dataInicioEvento'] as string | undefined;
        const reference = eventoDataStr
            ? new Date(eventoDataStr.split('T')[0] + 'T00:00:00')
            : new Date();
        let age = reference.getFullYear() - birth.getFullYear();
        const m = reference.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && reference.getDate() < birth.getDate())) age--;
        if (v!.minAge != null && age < v!.minAge)
            return `Idade mínima: ${v!.minAge} ano${v!.minAge !== 1 ? 's' : ''}`;
        if (v!.maxAge != null && age > v!.maxAge)
            return `Idade máxima: ${v!.maxAge} ano${v!.maxAge !== 1 ? 's' : ''}`;
    }

    if (v?.regex) {
        const re = getCompiledRegex(v.regex);
        if (re && !re.test(str)) return v.regexMessage || 'Formato inválido';
    }

    return undefined;
};

// ── validateStepData (público) ────────────────────────────────────────────────

/**
 * Valida os dados submetidos para um step, respeitando condicionais (AND/OR).
 * Campos ocultos pela condicional são ignorados — não geram erro de validação.
 *
 * Uso no frontend (renderer): substitui `validateSingleField` em `makeStepResolver`.
 * Uso no backend (NestJS): substitui `FormSchemaValidatorService.processarStep`.
 *
 * @param step         - Step do FormSchema sendo validado
 * @param dados        - Payload recebido `{ [campo.nome]: valor }`
 * @param externalData - Dados externos (ex: `{ 'evento.dataInicioEvento': '2026-07-10' }`)
 */
export const validateStepData = (
    step: FormStep,
    dados: Record<string, unknown>,
    externalData: Record<string, unknown> = {},
): ResultadoValidacaoStep => {
    const errors: ValidacaoCampoErro[] = [];

    const sortedContainers = [...step.containers].sort((a, b) => a.ordem - b.ordem);

    for (const container of sortedContainers) {
        // Pula containers repetíveis — tratados separadamente pelo renderer
        if (container.repeatable) continue;

        const containerVisible = evaluateFieldCondition(container.condicional, dados, externalData);
        if (!containerVisible) continue;

        const sortedFields = [...container.campos].sort((a, b) => a.ordem - b.ordem);

        for (const field of sortedFields) {
            if (field.tipo === FieldType.HIDDEN) continue;
            if (field.isDisabled || field.isReadOnly) continue;

            const visible = evaluateFieldCondition(field.condicional, dados, externalData);
            if (!visible) continue;

            // ── FIELD_ARRAY ─────────────────────────────────────────────────
            if (field.tipo === FieldType.FIELD_ARRAY) {
                const items = Array.isArray(dados[field.nome])
                    ? (dados[field.nome] as Record<string, unknown>[])
                    : [];

                if (field.obrigatorio && items.length === 0) {
                    errors.push({ campo: field.nome, label: field.label, message: 'Adicione pelo menos um item' });
                } else if (field.minItems && items.length < field.minItems) {
                    errors.push({
                        campo: field.nome,
                        label: field.label,
                        message: `Mínimo de ${field.minItems} item${field.minItems !== 1 ? 's' : ''}`,
                    });
                } else if (field.maxItems && items.length > field.maxItems) {
                    errors.push({
                        campo: field.nome,
                        label: field.label,
                        message: `Máximo de ${field.maxItems} item${field.maxItems !== 1 ? 's' : ''}`,
                    });
                }

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (!item) continue;
                    for (const subField of (field.subFields ?? [])) {
                        if (subField.isDisabled || subField.isReadOnly) continue;
                        const subVisible = evaluateFieldCondition(subField.condicional, item as Record<string, unknown>, externalData);
                        if (!subVisible) continue;
                        const msg = validateField(subField, (item as Record<string, unknown>)[subField.nome], externalData);
                        if (msg) {
                            errors.push({
                                campo: `${field.nome}[${i}].${subField.nome}`,
                                label: subField.label,
                                message: msg,
                            });
                        }
                    }
                }
                continue;
            }

            // ── SUB_FORM ────────────────────────────────────────────────────
            if (field.tipo === FieldType.SUB_FORM) {
                const subValues = (dados[field.nome] as Record<string, unknown> | null | undefined) ?? {};
                if (field.obrigatorio && Object.keys(subValues).length === 0) {
                    errors.push({ campo: field.nome, label: field.label, message: 'Campo obrigatório' });
                }
                for (const subField of (field.subSchema?.fields ?? [])) {
                    if (subField.isDisabled || subField.isReadOnly) continue;
                    const msg = validateField(subField, subValues[subField.nome], externalData);
                    if (msg) {
                        errors.push({
                            campo: `${field.nome}.${subField.nome}`,
                            label: subField.label,
                            message: msg,
                        });
                    }
                }
                continue;
            }

            // ── Campo simples ───────────────────────────────────────────────
            const msg = validateField(field, dados[field.nome], externalData);
            if (msg) {
                errors.push({ campo: field.nome, label: field.label, message: msg });
            }
        }
    }

    return { valid: errors.length === 0, errors };
};
