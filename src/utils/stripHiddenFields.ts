import { FieldType, type FormStep } from '../types/formSchema';
import { evaluateFieldCondition } from './evaluateFieldCondition';

/**
 * Remove dos valores submetidos os campos que estejam ocultos (condição não satisfeita).
 * Retorna:
 *  - `cleaned`: payload sem as chaves dos campos ocultos
 *  - `fileIdsToDelete`: uploadIds de campos FILE ocultos que devem ser deletados do storage
 */
export const stripHiddenFields = (
    step: FormStep,
    values: Record<string, unknown>,
    externalData: Record<string, unknown> = {},
): { cleaned: Record<string, unknown>; fileIdsToDelete: string[] } => {
    const cleaned = { ...values };
    const fileIdsToDelete: string[] = [];

    const sortedContainers = [...step.containers].sort((a, b) => a.ordem - b.ordem);

    for (const container of sortedContainers) {
        if (container.repeatable) continue;

        const containerVisible = evaluateFieldCondition(container.condicional, values, externalData);

        const sortedFields = [...container.campos].sort((a, b) => a.ordem - b.ordem);

        for (const field of sortedFields) {
            const fieldVisible =
                containerVisible &&
                evaluateFieldCondition(field.condicional, values, externalData);

            if (!fieldVisible) {
                if (field.tipo === FieldType.FILE) {
                    const uploadId = cleaned[field.nome];
                    if (typeof uploadId === 'string' && uploadId) {
                        fileIdsToDelete.push(uploadId);
                    }
                }
                delete cleaned[field.nome];
            }
        }
    }

    return { cleaned, fileIdsToDelete };
};
