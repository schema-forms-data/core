# @schema-forms-data/core

> Core types, enums e utilitários do SchemaForms — zero dependências de runtime, TypeScript puro.

[![npm](https://img.shields.io/npm/v/@schema-forms-data/core)](https://www.npmjs.com/package/@schema-forms-data/core)
[![license](https://img.shields.io/npm/l/@schema-forms-data/core)](./LICENSE)

Este é o pacote base de todo o ecossistema `@schema-forms-data`. Todos os outros pacotes dependem dele. Não tem dependências de runtime — é TypeScript puro com zero overhead.

## Install

```bash
pnpm add @schema-forms-data/core
```

## O que inclui

- **`FormSchema`** e **`FormTemplate`** — tipos centrais do schema de formulário
- **`FieldType`** — enum com todos os tipos de campo (`TEXTO`, `EMAIL`, `CPF`, `CEP`, `TELEFONE`, `SELECT`, `CHECKBOX`, `DATA`, e mais)
- **Utilitários:**
  - `generateUUID` — geração de IDs únicos
  - `evaluateFieldCondition` — lógica de visibilidade condicional de campos
  - `validateStepData` — validação de dados por step
  - `stripHiddenFields` — remove campos ocultos antes do submit
  - `regexes` — padrões regex comuns (CPF, CEP, telefone, etc.)

## Uso

```ts
import { FormSchema, FieldType, evaluateFieldCondition } from '@schema-forms-data/core';
```

## Dependências em outros pacotes

`@schema-forms-data/core` não depende de nenhum outro pacote do ecossistema.
Os demais (`templates`, `ui`, `renderer`, `builder`, `react`) dependem dele.

---

## Ordem de atualização

`core` é a **raiz** da cadeia — todos os outros pacotes dependem dele.

Ao bumpar `core`, siga esta ordem nos demais:

```
core  →  templates  →  ui  →  renderer  →  builder  →  react
```

1. Bumpa e publica `core`
2. Em cada pacote dependente, atualiza a versão de `@schema-forms-data/core` no `package.json`
3. Segue a ordem acima para os bumps subsequentes

## Licença

[MIT](LICENSE) © schema-forms-data
