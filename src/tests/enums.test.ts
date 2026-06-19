import { describe, it, expect } from 'vitest';
import {
    FieldType,
    FormSchemaStatus,
    MaskType,
    FIELD_TYPE_LABELS,
    FIELD_TYPE_ICONS,
} from '../types/formSchema';

// ── FieldType ─────────────────────────────────────────────────────────────────

describe('FieldType', () => {
    const ALL_TYPES = Object.values(FieldType);

    it('possui 28 tipos únicos', () => {
        expect(ALL_TYPES).toHaveLength(28);
        expect(new Set(ALL_TYPES).size).toBe(28);
    });

    it('todos os valores são strings lowercase_snake_case', () => {
        const SNAKE = /^[a-z][a-z0-9_]*$/;
        for (const t of ALL_TYPES) {
            expect(SNAKE.test(t), `FieldType "${t}" fora do padrão`).toBe(true);
        }
    });

    it('mapeia corretamente cada chave para seu valor string', () => {
        const expected: [keyof typeof FieldType, string][] = [
            ['TEXTO', 'texto'],
            ['TEXTAREA', 'textarea'],
            ['NUMBER', 'number'],
            ['EMAIL', 'email'],
            ['PASSWORD', 'password'],
            ['TELEFONE', 'telefone'],
            ['CPF', 'cpf'],
            ['CEP', 'cep'],
            ['DATE', 'date'],
            ['DATETIME', 'datetime'],
            ['TIME', 'time'],
            ['DATE_RANGE', 'date_range'],
            ['SELECT', 'select'],
            ['AUTOCOMPLETE', 'autocomplete'],
            ['RADIO', 'radio'],
            ['CHECKBOX', 'checkbox'],
            ['CHECKBOX_GROUP', 'checkbox_group'],
            ['SWITCH', 'switch'],
            ['SLIDER', 'slider'],
            ['RATING', 'rating'],
            ['COLOR', 'color'],
            ['FILE', 'file'],
            ['HIDDEN', 'hidden'],
            ['FIELD_ARRAY', 'field_array'],
            ['PARTICIPATION_TYPE', 'participation_type'],
            ['PAYMENT_METHOD', 'payment_method'],
            ['TERMS', 'terms'],
            ['SUB_FORM', 'sub_form'],
        ];
        for (const [key, val] of expected) {
            expect(FieldType[key]).toBe(val);
        }
    });
});

// ── FormSchemaStatus ──────────────────────────────────────────────────────────

describe('FormSchemaStatus', () => {
    it('possui exatamente 3 status', () => {
        expect(Object.values(FormSchemaStatus)).toHaveLength(3);
    });

    it('valores corretos', () => {
        expect(FormSchemaStatus.RASCUNHO).toBe('rascunho');
        expect(FormSchemaStatus.ATIVO).toBe('ativo');
        expect(FormSchemaStatus.INATIVO).toBe('inativo');
    });
});

// ── MaskType ──────────────────────────────────────────────────────────────────

describe('MaskType', () => {
    it('possui exatamente 4 tipos de máscara', () => {
        expect(Object.values(MaskType)).toHaveLength(4);
    });

    it('valores corretos', () => {
        expect(MaskType.CPF).toBe('cpf');
        expect(MaskType.TELEFONE).toBe('telefone');
        expect(MaskType.CEP).toBe('cep');
        expect(MaskType.CUSTOM).toBe('custom');
    });
});

// ── FIELD_TYPE_LABELS ─────────────────────────────────────────────────────────

describe('FIELD_TYPE_LABELS', () => {
    const ALL_TYPES = Object.values(FieldType);

    it('cobre todos os 28 FieldType — sem faltando, sem extras', () => {
        expect(Object.keys(FIELD_TYPE_LABELS)).toHaveLength(ALL_TYPES.length);
        for (const t of ALL_TYPES) {
            expect(FIELD_TYPE_LABELS, `Faltando label para "${t}"`).toHaveProperty(t);
        }
    });

    it('todos os labels são strings não vazias', () => {
        for (const [type, label] of Object.entries(FIELD_TYPE_LABELS)) {
            expect(typeof label, `label de "${type}" não é string`).toBe('string');
            expect(label.length, `label de "${type}" está vazio`).toBeGreaterThan(0);
        }
    });

    it('spot checks de labels conhecidos', () => {
        expect(FIELD_TYPE_LABELS[FieldType.TEXTO]).toBe('Texto');
        expect(FIELD_TYPE_LABELS[FieldType.TEXTAREA]).toBe('Área de texto');
        expect(FIELD_TYPE_LABELS[FieldType.CPF]).toBe('CPF');
        expect(FIELD_TYPE_LABELS[FieldType.TERMS]).toBe('Termos e condições');
        expect(FIELD_TYPE_LABELS[FieldType.SUB_FORM]).toBe('Sub-formulário');
        expect(FIELD_TYPE_LABELS[FieldType.FIELD_ARRAY]).toBe('Lista de itens');
    });
});

// ── FIELD_TYPE_ICONS ──────────────────────────────────────────────────────────

describe('FIELD_TYPE_ICONS', () => {
    const ALL_TYPES = Object.values(FieldType);
    // Lucide usa PascalCase: "AlignLeft", "CalendarRange", etc.
    const PASCAL_CASE = /^[A-Z][A-Za-z0-9]+$/;

    it('cobre todos os 28 FieldType — sem faltando, sem extras', () => {
        expect(Object.keys(FIELD_TYPE_ICONS)).toHaveLength(ALL_TYPES.length);
        for (const t of ALL_TYPES) {
            expect(FIELD_TYPE_ICONS, `Faltando ícone para "${t}"`).toHaveProperty(t);
        }
    });

    it('todos os ícones são strings PascalCase (convenção Lucide)', () => {
        for (const [type, icon] of Object.entries(FIELD_TYPE_ICONS)) {
            expect(PASCAL_CASE.test(icon), `Ícone "${icon}" de "${type}" não é PascalCase`).toBe(true);
        }
    });

    it('spot checks de ícones conhecidos', () => {
        expect(FIELD_TYPE_ICONS[FieldType.TEXTO]).toBe('Type');
        expect(FIELD_TYPE_ICONS[FieldType.FILE]).toBe('Upload');
        expect(FIELD_TYPE_ICONS[FieldType.DATE_RANGE]).toBe('CalendarRange');
        expect(FIELD_TYPE_ICONS[FieldType.PAYMENT_METHOD]).toBe('Wallet');
        expect(FIELD_TYPE_ICONS[FieldType.SUB_FORM]).toBe('LayoutList');
    });
});