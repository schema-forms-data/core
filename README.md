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

## Build

```bash
pnpm install
pnpm build      # vite build + tsc -> dist/
```

## Publicar

Automático: a cada **push na `main`**, o workflow (`.github/workflows/publish.yml`)
publica **somente se a versão do `package.json` ainda não existir no npm**. Push de
README/refactor não republica nada — pra lançar, basta dar bump na versão:

```bash
npm version patch        # 4.0.7 -> 4.0.8 (faz commit + tag)
git push --follow-tags   # push na main dispara o publish da nova versão
```

Requer o secret **`NPM_TOKEN`** no repositório GitHub (Settings → Secrets → Actions →
`NPM_TOKEN`). Gere um **Automation token** em npmjs.com → Account → Access Tokens.
O flag `--provenance` anexa attestation de build automaticamente (rastreabilidade de
supply chain, sem custo extra).

## Licença

[MIT](LICENSE) © schema-forms-data
