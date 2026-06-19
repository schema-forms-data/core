# @schema-forms-data/core

> Core types, enums and utilities for SchemaForms — zero runtime dependencies, pure TypeScript.

[![npm](https://img.shields.io/npm/v/@schema-forms-data/core)](https://www.npmjs.com/package/@schema-forms-data/core)
[![license](https://img.shields.io/npm/l/@schema-forms-data/core)](./LICENSE)

## Install

```bash
pnpm add @schema-forms-data/core
```

## What's included

- `FormSchema` and `FormTemplate` types
- `FieldType` enum (TEXTO, EMAIL, CPF, CEP, TELEFONE, and more)
- Utilities: UUID generation, regex patterns, field condition evaluation, step validation, hidden field stripping

## Usage

```ts
import { FormSchema, FieldType, evaluateFieldCondition } from '@schema-forms-data/core';
```

## License

MIT © SchemaForms
