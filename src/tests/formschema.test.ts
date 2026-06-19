import { describe, it, expect } from 'vitest';
import type {
    FormSchema,
    FormStep,
    FormContainer,
    FormField,
    FieldConditional,
    FieldConditionGroup,
    FieldConditionalExpr,
    FieldValidation,
    FieldValidatorConfig,
    FieldOption,
    ConditionalSetValue,
} from '../types/formSchema';
import { FieldType, FormSchemaStatus, MaskType } from '../types/formSchema';

// ── Factories ─────────────────────────────────────────────────────────────────

function field(overrides: Partial<FormField> = {}): FormField {
    return {
        id: 'f1',
        nome: 'campo',
        label: 'Campo',
        tipo: FieldType.TEXTO,
        obrigatorio: false,
        tamanho: 12,
        ordem: 1,
        ...overrides,
    };
}

function container(overrides: Partial<FormContainer> = {}): FormContainer {
    return {
        id: 'c1',
        titulo: 'Container',
        ordem: 1,
        campos: [],
        ...overrides,
    };
}

function step(overrides: Partial<FormStep> = {}): FormStep {
    return {
        id: 's1',
        titulo: 'Step',
        ordem: 1,
        containers: [],
        ...overrides,
    };
}

function schema(overrides: Partial<FormSchema> = {}): FormSchema {
    return {
        id: 'form-1',
        nome: 'Formulário',
        status: FormSchemaStatus.ATIVO,
        steps: [],
        ...overrides,
    };
}

// ── FormSchema ────────────────────────────────────────────────────────────────

describe('FormSchema', () => {
    it('cria schema mínimo válido', () => {
        const s = schema();
        expect(s.id).toBe('form-1');
        expect(s.status).toBe('ativo');
        expect(s.steps).toHaveLength(0);
    });

    it('aceita todos os campos opcionais', () => {
        const s = schema({
            descricao: 'desc',
            eventoId: 'evt-1',
            template: 'dark',
            createdAt: '2024-01-01',
            updatedAt: '2024-06-01',
        });
        expect(s.descricao).toBe('desc');
        expect(s.eventoId).toBe('evt-1');
        expect(s.template).toBe('dark');
    });

    it('aceita eventoId null e template null', () => {
        const s = schema({ eventoId: null, template: null });
        expect(s.eventoId).toBeNull();
        expect(s.template).toBeNull();
    });

    it('todos os FormSchemaStatus são aceitos', () => {
        for (const status of Object.values(FormSchemaStatus)) {
            expect(() => schema({ status })).not.toThrow();
        }
    });

    it('suporta múltiplos steps aninhados', () => {
        const s = schema({
            steps: [
                step({ id: 's1', ordem: 1, titulo: 'Pessoal' }),
                step({ id: 's2', ordem: 2, titulo: 'Endereço' }),
                step({ id: 's3', ordem: 3, titulo: 'Pagamento' }),
            ],
        });
        expect(s.steps).toHaveLength(3);
        expect(s.steps[1]?.titulo).toBe('Endereço');
    });
});

// ── FormContainer ─────────────────────────────────────────────────────────────

describe('FormContainer', () => {
    it('aceita colunas 1 a 4', () => {
        for (const colunas of [1, 2, 3, 4] as const) {
            expect(container({ colunas }).colunas).toBe(colunas);
        }
    });

    it('suporta modo repetível com limites', () => {
        const c = container({ repeatable: true, minItems: 1, maxItems: 5, itemLabel: 'Contato' });
        expect(c.repeatable).toBe(true);
        expect(c.minItems).toBe(1);
        expect(c.maxItems).toBe(5);
        expect(c.itemLabel).toBe('Contato');
    });

    it('aceita condicional', () => {
        const cond: FieldConditional = { campoId: 'tipo', operador: 'igual', valor: 'pf' };
        const c = container({ condicional: cond });
        expect(c.condicional).toEqual(cond);
    });
});

// ── FormField ─────────────────────────────────────────────────────────────────

describe('FormField — campos base', () => {
    it('aceita todos os 28 FieldType sem erro', () => {
        for (const tipo of Object.values(FieldType)) {
            expect(() => field({ tipo })).not.toThrow();
        }
    });

    it('aceita defaultValue e initialValue de todos os tipos primitivos', () => {
        expect(field({ defaultValue: 'texto' }).defaultValue).toBe('texto');
        expect(field({ defaultValue: 42 }).defaultValue).toBe(42);
        expect(field({ defaultValue: true }).defaultValue).toBe(true);
        expect(field({ initialValue: '{{evento.nome}}' }).initialValue).toBe('{{evento.nome}}');
    });

    it('aceita clearedValue null e primitivos', () => {
        expect(field({ clearedValue: null }).clearedValue).toBeNull();
        expect(field({ clearedValue: '' }).clearedValue).toBe('');
        expect(field({ clearedValue: 0 }).clearedValue).toBe(0);
        expect(field({ clearedValue: false }).clearedValue).toBe(false);
    });

    it('aceita todos os MaskType', () => {
        for (const mascara of Object.values(MaskType)) {
            expect(field({ mascara }).mascara).toBe(mascara);
        }
    });

    it('aceita mascaraCustom', () => {
        const f = field({ mascara: MaskType.CUSTOM, mascaraCustom: '99/99/9999' });
        expect(f.mascaraCustom).toBe('99/99/9999');
    });

    it('suporta flags isReadOnly, isDisabled, locked', () => {
        const f = field({ isReadOnly: true, isDisabled: false, locked: true });
        expect(f.isReadOnly).toBe(true);
        expect(f.isDisabled).toBe(false);
        expect(f.locked).toBe(true);
    });
});

describe('FormField — opcoes', () => {
    it('FieldOption com disabled opcional', () => {
        const opcoes: FieldOption[] = [
            { valor: 'a', label: 'A' },
            { valor: 'b', label: 'B', disabled: true },
        ];
        const f = field({ tipo: FieldType.SELECT, opcoes });
        expect(f.opcoes).toHaveLength(2);
        expect(f.opcoes?.[1]?.disabled).toBe(true);
    });

    it('opcoesFromVar para carregar opções por variável', () => {
        expect(field({ opcoesFromVar: 'estados' }).opcoesFromVar).toBe('estados');
    });
});

describe('FormField — validação', () => {
    it('FieldValidation com todos os campos', () => {
        const validacao: FieldValidation = {
            minLength: 3,
            maxLength: 100,
            min: 0,
            max: 999,
            regex: '^[A-Z]+$',
            regexMessage: 'Apenas letras maiúsculas',
            minDate: '2020-01-01',
            maxDate: '2030-12-31',
            fileTypes: ['image/png', 'image/jpeg'],
            maxFileSize: 5_242_880,
            minAge: 18,
            maxAge: 60,
        };
        expect(field({ validacao }).validacao).toEqual(validacao);
    });

    it('validate com validadores customizados bloqueantes', () => {
        const validate: FieldValidatorConfig[] = [
            { type: 'cpfUnico', message: 'CPF já cadastrado' },
            { type: 'maiorDeIdade', minAge: 18 },
        ];
        const f = field({ validate });
        expect(f.validate).toHaveLength(2);
        expect(f.validate?.[0]?.type).toBe('cpfUnico');
        expect(f.validate?.[1]?.['minAge']).toBe(18);
    });

    it('warn com validadores não bloqueantes', () => {
        const warn: FieldValidatorConfig[] = [{ type: 'emailCorporativo' }];
        expect(field({ warn }).warn).toHaveLength(1);
    });
});

describe('FormField — FIELD_ARRAY', () => {
    it('aceita subFields, addLabel, minItems, maxItems, itemLabel', () => {
        const subFields = [field({ id: 'sf1', nome: 'nome_item' })];
        const f = field({
            tipo: FieldType.FIELD_ARRAY,
            subFields,
            addLabel: '+ Adicionar item',
            minItems: 1,
            maxItems: 10,
            itemLabel: 'Item',
        });
        expect(f.subFields).toHaveLength(1);
        expect(f.addLabel).toBe('+ Adicionar item');
        expect(f.minItems).toBe(1);
        expect(f.maxItems).toBe(10);
    });
});

describe('FormField — SUB_FORM', () => {
    it('aceita subSchema com titulo e fields', () => {
        const f = field({
            tipo: FieldType.SUB_FORM,
            subSchema: {
                titulo: 'Endereço',
                fields: [field({ id: 'sf1', nome: 'rua' })],
            },
        });
        expect(f.subSchema?.titulo).toBe('Endereço');
        expect(f.subSchema?.fields).toHaveLength(1);
    });

    it('aceita subSchema sem titulo', () => {
        const f = field({
            tipo: FieldType.SUB_FORM,
            subSchema: { fields: [] },
        });
        expect(f.subSchema?.titulo).toBeUndefined();
    });
});

describe('FormField — CEP', () => {
    it('aceita cepFillMap completo', () => {
        const f = field({
            tipo: FieldType.CEP,
            cepFillMap: { logradouro: 'rua', bairro: 'bairro', cidade: 'cidade', estado: 'uf' },
        });
        expect(f.cepFillMap?.logradouro).toBe('rua');
        expect(f.cepFillMap?.estado).toBe('uf');
    });

    it('aceita cepFillMap parcial', () => {
        const f = field({ tipo: FieldType.CEP, cepFillMap: { cidade: 'municipio' } });
        expect(f.cepFillMap?.cidade).toBe('municipio');
        expect(f.cepFillMap?.logradouro).toBeUndefined();
    });
});

describe('FormField — SLIDER / RATING / DATE_RANGE', () => {
    it('SLIDER aceita step, minValue, maxValue', () => {
        const f = field({ tipo: FieldType.SLIDER, step: 5, minValue: 0, maxValue: 100 });
        expect(f.step).toBe(5);
        expect(f.minValue).toBe(0);
        expect(f.maxValue).toBe(100);
    });

    it('RATING aceita maxRating', () => {
        expect(field({ tipo: FieldType.RATING, maxRating: 10 }).maxRating).toBe(10);
    });

    it('DATE_RANGE aceita labels de início e fim', () => {
        const f = field({
            tipo: FieldType.DATE_RANGE,
            dateRangeStartLabel: 'Check-in',
            dateRangeEndLabel: 'Check-out',
        });
        expect(f.dateRangeStartLabel).toBe('Check-in');
        expect(f.dateRangeEndLabel).toBe('Check-out');
    });
});

describe('FormField — TERMS', () => {
    it('aceita termoTexto', () => {
        expect(field({ tipo: FieldType.TERMS, termoTexto: 'Aceito os termos.' }).termoTexto)
            .toBe('Aceito os termos.');
    });

    it('aceita termoPdfUrl e termoPdfUploadId', () => {
        const f = field({
            tipo: FieldType.TERMS,
            termoPdfUrl: 'https://example.com/termos.pdf',
            termoPdfUploadId: 'upload-abc',
        });
        expect(f.termoPdfUrl).toContain('termos.pdf');
        expect(f.termoPdfUploadId).toBe('upload-abc');
    });
});

describe('FormField — PAYMENT_METHOD', () => {
    it('aceita relatedFieldName', () => {
        const f = field({ tipo: FieldType.PAYMENT_METHOD, relatedFieldName: 'participacao_escolhida' });
        expect(f.relatedFieldName).toBe('participacao_escolhida');
    });
});

// ── FieldConditional ──────────────────────────────────────────────────────────

describe('FieldConditional', () => {
    const operadores = [
        'igual', 'diferente', 'contem', 'naoContem',
        'vazio', 'naoVazio', 'maiorQue', 'menorQue',
        'maiorOuIgual', 'menorOuIgual',
    ] as FieldConditional['operador'][];

    it('suporta todos os 10 operadores', () => {
        for (const operador of operadores) {
            const c: FieldConditional = { campoId: 'x', operador };
            expect(c.operador).toBe(operador);
        }
    });

    it('operadores de vazio não precisam de valor', () => {
        const c: FieldConditional = { campoId: 'obs', operador: 'vazio' };
        expect(c.valor).toBeUndefined();
    });

    it('valor pode ser string, number ou boolean', () => {
        expect(field({ condicional: { campoId: 'a', operador: 'igual', valor: 'texto' } })).toBeTruthy();
        expect(field({ condicional: { campoId: 'a', operador: 'maiorQue', valor: 18 } })).toBeTruthy();
        expect(field({ condicional: { campoId: 'a', operador: 'igual', valor: true } })).toBeTruthy();
    });

    it('source pode ser "campo" ou "evento"', () => {
        const c: FieldConditional = { campoId: 'x', operador: 'igual', valor: '1', source: 'evento' };
        expect(c.source).toBe('evento');
    });
});

describe('FieldConditionGroup (AND / OR / recursivo)', () => {
    it('grupo AND com duas condições folha', () => {
        const g: FieldConditionGroup = {
            and: [
                { campoId: 'idade', operador: 'maiorOuIgual', valor: 18 },
                { campoId: 'pais', operador: 'igual', valor: 'BR' },
            ],
        };
        expect(g.and).toHaveLength(2);
    });

    it('grupo OR com condições mistas', () => {
        const g: FieldConditionGroup = {
            or: [
                { campoId: 'role', operador: 'igual', valor: 'admin' },
                { campoId: 'role', operador: 'igual', valor: 'superadmin' },
            ],
        };
        expect(g.or).toHaveLength(2);
    });

    it('expressão recursiva: OR contendo AND interno', () => {
        const expr: FieldConditionalExpr = {
            or: [
                { campoId: 'role', operador: 'igual', valor: 'admin' },
                {
                    and: [
                        { campoId: 'role', operador: 'igual', valor: 'editor' },
                        { campoId: 'ativo', operador: 'igual', valor: true },
                    ],
                },
            ],
        };
        expect('or' in expr).toBe(true);
        const orItems = (expr as FieldConditionGroup).or!;
        expect(orItems).toHaveLength(2);
        expect('and' in orItems[1]!).toBe(true);
    });
});

describe('ConditionalSetValue', () => {
    it('aceita todos os tipos de valor incluindo null', () => {
        const cases: ConditionalSetValue[] = [
            { campo: 'nome', valor: 'João' },
            { campo: 'idade', valor: 30 },
            { campo: 'ativo', valor: true },
            { campo: 'deleted', valor: null },
        ];
        expect(cases[0]?.valor).toBe('João');
        expect(cases[3]?.valor).toBeNull();
    });
});