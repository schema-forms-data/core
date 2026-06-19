import { describe, it, expect } from 'vitest';
import type {
    FormTemplateConfig,
    FormTemplateColors,
    FormTemplateLayout,
    PresetBlock,
    PresetStepBlock,
} from '../types/formTemplate';

function colors(overrides: Partial<FormTemplateColors> = {}): FormTemplateColors {
    return {
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        accent: '#f59e0b',
        background: '#fff',
        surface: '#f8fafc',
        text: '#1e293b',
        textMuted: '#64748b',
        border: '#e2e8f0',
        error: '#ef4444',
        ...overrides,
    };
}

function layout(overrides: Partial<FormTemplateLayout> = {}): FormTemplateLayout {
    return {
        stepNavigation: 'wizard',
        containerStyle: 'card',
        spacing: 'normal',
        roundness: '0.5rem',
        showProgressBar: true,
        showStepIndicators: true,
        ...overrides,
    };
}

function config(overrides: Partial<FormTemplateConfig> = {}): FormTemplateConfig {
    return { id: 'default', displayName: 'Default', colors: colors(), layout: layout(), ...overrides };
}

describe('FormTemplateConfig', () => {
    it('cria config mínima', () => {
        const c = config();
        expect(c.id).toBe('default');
        expect(c.colors.primary).toBe('#3b82f6');
    });

    it('aceita typography e wrapperClass opcionais', () => {
        const c = config({
            wrapperClass: 'max-w-2xl mx-auto',
            typography: {
                fontFamily: "'Inter', sans-serif",
                stepTitleClass: 'text-2xl font-bold',
                stepDescClass: 'text-sm text-muted',
                labelClass: 'text-sm font-medium',
            },
        });
        expect(c.wrapperClass).toBe('max-w-2xl mx-auto');
        expect(c.typography?.fontFamily).toContain('Inter');
    });
});

describe('FormTemplateLayout — variantes', () => {
    it('stepNavigation: wizard | tabs | vertical', () => {
        for (const nav of ['wizard', 'tabs', 'vertical'] as const) {
            expect(layout({ stepNavigation: nav }).stepNavigation).toBe(nav);
        }
    });

    it('containerStyle: card | glassmorphism | flat | bordered', () => {
        for (const style of ['card', 'glassmorphism', 'flat', 'bordered'] as const) {
            expect(layout({ containerStyle: style }).containerStyle).toBe(style);
        }
    });

    it('spacing: compact | normal | relaxed', () => {
        for (const spacing of ['compact', 'normal', 'relaxed'] as const) {
            expect(layout({ spacing }).spacing).toBe(spacing);
        }
    });

    it('stepIndicatorVariant: numbers | icons | icons-labeled', () => {
        for (const v of ['numbers', 'icons', 'icons-labeled'] as const) {
            expect(layout({ stepIndicatorVariant: v }).stepIndicatorVariant).toBe(v);
        }
    });

    it('stepIndicatorPosition: top-center | top-left', () => {
        for (const p of ['top-center', 'top-left'] as const) {
            expect(layout({ stepIndicatorPosition: p }).stepIndicatorPosition).toBe(p);
        }
    });

    it('stepIndicatorOrientation: horizontal | vertical', () => {
        for (const o of ['horizontal', 'vertical'] as const) {
            expect(layout({ stepIndicatorOrientation: o }).stepIndicatorOrientation).toBe(o);
        }
    });

    it('eventTitleStyle: bar | inline | hidden', () => {
        for (const s of ['bar', 'inline', 'hidden'] as const) {
            expect(layout({ eventTitleStyle: s }).eventTitleStyle).toBe(s);
        }
    });
});

describe('PresetBlock', () => {
    const CATEGORIES = ['personal', 'address', 'health', 'event', 'payment', 'emergency'] as const;

    it('aceita todas as 6 categorias', () => {
        for (const category of CATEGORIES) {
            const b: PresetBlock = {
                id: `preset-${category}`,
                name: category,
                description: '',
                icon: 'Box',
                category,
                containerTemplate: { titulo: category, ordem: 1, campos: [] },
            };
            expect(b.category).toBe(category);
        }
    });
});

describe('PresetStepBlock', () => {
    it('cria bloco com múltiplos steps e containers', () => {
        const block: PresetStepBlock = {
            id: 'registration',
            name: 'Inscrição',
            description: 'Fluxo completo de inscrição',
            icon: 'ClipboardList',
            steps: [
                { titulo: 'Dados', containers: [{ titulo: 'Info', ordem: 1, campos: [] }] },
                { titulo: 'Endereço', containers: [{ titulo: 'End', ordem: 1, campos: [] }] },
            ],
        };
        expect(block.steps).toHaveLength(2);
        expect(block.steps[0]?.containers[0]?.titulo).toBe('Info');
    });
});