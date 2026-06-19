/**
 * Avalia se um campo/container deve ser visível com base na sua condição.
 *
 * Suporta:
 * - Condição folha: `{ campoId, operador, valor, source? }`
 * - Grupo AND: `{ and: [...] }` — todas as condições devem ser verdadeiras
 * - Grupo OR:  `{ or: [...]  }` — ao menos uma condição deve ser verdadeira
 * - Grupos podem ser aninhados recursivamente.
 */

import type { FieldConditional, FieldConditionalExpr } from '../types/formSchema';

/**
 * Avalia uma FieldConditionalExpr recursivamente.
 */
export const evaluateFieldCondition = (
    cond: FieldConditionalExpr | undefined,
    values: Record<string, unknown>,
    externalData: Record<string, unknown> = {},
): boolean => {
    if (!cond) return true;

    // ── Grupo AND/OR ──────────────────────────────────────────────────────
    if ('and' in cond || 'or' in cond) {
        const hasAnd = 'and' in cond && Array.isArray(cond.and) && cond.and.length > 0;
        const hasOr = 'or' in cond && Array.isArray(cond.or) && cond.or.length > 0;
        if (hasAnd && hasOr) {
            console.warn('[evaluateFieldCondition] FieldConditionGroup com `and` e `or` simultâneos — apenas `and` será avaliado.');
            return (cond.and as FieldConditionalExpr[]).every((c) => evaluateFieldCondition(c, values, externalData));
        }
        if (hasAnd) {
            return (cond.and as FieldConditionalExpr[]).every((c) => evaluateFieldCondition(c, values, externalData));
        }
        if (hasOr) {
            return (cond.or as FieldConditionalExpr[]).some((c) => evaluateFieldCondition(c, values, externalData));
        }
        return true; // grupo vazio → visível
    }

    // ── Condição folha ────────────────────────────────────────────────────
    const leaf = cond as FieldConditional;
    if (!leaf.campoId) return true;

    const raw =
        leaf.source === 'evento'
            ? externalData[leaf.campoId]
            : values[leaf.campoId];

    // Arrays (CHECKBOX_GROUP, etc.) — avalia diretamente, sem converter para string,
    // evitando falsos positivos de substring (ex: "dia" dentro de "segunda,dia10").
    if (Array.isArray(raw)) {
        const targetVal = leaf.valor;
        switch (leaf.operador) {
            case 'contem': return raw.includes(targetVal);
            case 'naoContem': return !raw.includes(targetVal);
            case 'vazio': return raw.length === 0;
            case 'naoVazio': return raw.length > 0;
            case 'igual': return raw.length === 1 && raw[0] === targetVal;
            case 'diferente': return !(raw.length === 1 && raw[0] === targetVal);
            default: return true;
        }
    }

    // boolean false (checkbox/switch desmarcado) e null/undefined → string vazia
    // true → '1' para que operadores numéricos (maiorQue, etc.) funcionem corretamente.
    const val = (raw === undefined || raw === null || raw === false)
        ? ''
        : raw === true
            ? '1'
            : String(raw);
    const target = leaf.valor !== undefined ? String(leaf.valor) : '';
    const numVal = Number(val);
    const numTarget = Number(target);

    switch (leaf.operador) {
        case 'igual':
            return val === target;
        case 'diferente':
            return val !== target;
        case 'vazio':
            return !val;
        case 'naoVazio':
            return !!val;
        case 'contem':
            return val.includes(target);
        case 'naoContem':
            return !val.includes(target);
        case 'maiorQue':
            if (!isNaN(numVal) && !isNaN(numTarget)) return numVal > numTarget;
            return val > target;
        case 'menorQue':
            if (!isNaN(numVal) && !isNaN(numTarget)) return numVal < numTarget;
            return val < target;
        case 'maiorOuIgual':
            if (!isNaN(numVal) && !isNaN(numTarget)) return numVal >= numTarget;
            return val >= target;
        case 'menorOuIgual':
            if (!isNaN(numVal) && !isNaN(numTarget)) return numVal <= numTarget;
            return val <= target;
        default:
            return true;
    }
};
