/**
 * Gera um UUID v4.
 * 1º) `crypto.randomUUID()` — Node 22+, browsers modernos.
 * 2º) `crypto.getRandomValues()` — CSPRNG disponível em Node 15+ e browsers legados.
 * 3º) `Math.random()` — último recurso; NÃO é CSPRNG, usado apenas em ambientes
 *     muito antigos onde `crypto` não existe.
 */
export const generateId = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // Segundo nível: crypto.getRandomValues (CSPRNG)
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        bytes[6] = (bytes[6]! & 0x0f) | 0x40; // version 4
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variant RFC 4122
        const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
    // Último recurso — Math.random não é CSPRNG
    console.warn(
        '[schema-forms-data] generateId: crypto API indisponível neste ambiente. ' +
        'Usando Math.random() como fallback — NÃO USE em contextos de segurança.',
    );
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

/** Alias de `generateId()` — mantido para compatibilidade */
export const v4Fallback = generateId;