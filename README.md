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

Usa **npm Trusted Publishing (OIDC)** — sem `NPM_TOKEN` armazenado — e anexa
**provenance** automaticamente.

> Primeira publicação: o Trusted Publisher do npm precisa do pacote já existindo.
> Faça a versão inicial uma vez manualmente (`npm publish`), depois configure o Trusted
> Publisher no npmjs.com e deixe o restante por conta do workflow.

## Licença

[MIT](LICENSE) © Inovex Tecnologia
