export const CPF_REGEX = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
export const TELEFONE_REGEX = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
export const CEP_REGEX = /^\d{5}-?\d{3}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Verifica o dígito verificador matemático do CPF (algoritmo módulo 11).
 * `CPF_REGEX` valida apenas o formato — esta função valida o conteúdo.
 */
export const isValidCpfDigits = (cpf: string): boolean => {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
    const calcDigit = (n: number): number => {
        let sum = 0;
        for (let i = 0; i < n; i++) sum += parseInt(digits[i]!) * (n + 1 - i);
        const remainder = (sum * 10) % 11;
        return remainder >= 10 ? 0 : remainder;
    };
    return calcDigit(9) === parseInt(digits[9]!) && calcDigit(10) === parseInt(digits[10]!);
};
