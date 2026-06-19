import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateId, v4Fallback } from '../utils/uuid';

const UUID_V4_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('generateId', () => {
    describe('com crypto.randomUUID disponível (padrão Node 22+)', () => {
        it('retorna uma string não vazia', () => {
            expect(typeof generateId()).toBe('string');
            expect(generateId().length).toBeGreaterThan(0);
        });

        it('retorna UUID v4 válido (RFC 4122)', () => {
            expect(UUID_V4_RE.test(generateId())).toBe(true);
        });

        it('tem exatamente 5 segmentos separados por hífen', () => {
            const parts = generateId().split('-');
            expect(parts).toHaveLength(5);
        });

        it('segmentos têm os comprimentos corretos: 8-4-4-4-12', () => {
            const [a, b, c, d, e] = generateId().split('-');
            expect(a?.length).toBe(8);
            expect(b?.length).toBe(4);
            expect(c?.length).toBe(4);
            expect(d?.length).toBe(4);
            expect(e?.length).toBe(12);
        });

        it('terceiro segmento começa com "4" (versão UUID)', () => {
            expect(generateId().split('-')[2]?.[0]).toBe('4');
        });

        it('quarto segmento começa com 8, 9, a ou b (variante RFC)', () => {
            const firstChar = generateId().split('-')[3]?.[0];
            expect(['8', '9', 'a', 'b']).toContain(firstChar);
        });

        it('gera 10.000 IDs sem colisão', () => {
            const ids = Array.from({ length: 10_000 }, generateId);
            expect(new Set(ids).size).toBe(10_000);
        });
    });

    describe('fallback sem crypto.randomUUID', () => {
        const originalCrypto = globalThis.crypto;

        beforeEach(() => {
            // Simula ambiente sem randomUUID (ex: Node 14, Deno antigo)
            Object.defineProperty(globalThis, 'crypto', {
                value: {},
                configurable: true,
                writable: true,
            });
        });

        afterEach(() => {
            Object.defineProperty(globalThis, 'crypto', {
                value: originalCrypto,
                configurable: true,
                writable: true,
            });
        });

        it('ainda retorna string com formato UUID', () => {
            const id = generateId();
            expect(typeof id).toBe('string');
            expect(id.split('-')).toHaveLength(5);
        });

        it('terceiro segmento começa com "4"', () => {
            expect(generateId().split('-')[2]?.[0]).toBe('4');
        });

        it('gera 1.000 IDs com menos de 0,5% de colisão', () => {
            const ids = Array.from({ length: 1_000 }, generateId);
            expect(new Set(ids).size).toBeGreaterThan(995);
        });
    });

    describe('sem crypto algum', () => {
        const originalCrypto = globalThis.crypto;

        beforeEach(() => {
            // @ts-expect-error — simulando ambiente sem crypto
            delete globalThis.crypto;
        });

        afterEach(() => {
            Object.defineProperty(globalThis, 'crypto', {
                value: originalCrypto,
                configurable: true,
                writable: true,
            });
        });

        it('usa o fallback e retorna string válida', () => {
            expect(typeof generateId()).toBe('string');
        });
    });
});

describe('v4Fallback', () => {
    it('é um alias de generateId — mesmo formato', () => {
        expect(UUID_V4_RE.test(v4Fallback())).toBe(true);
    });

    it('referencia a mesma função', () => {
        expect(v4Fallback).toBe(generateId);
    });
});