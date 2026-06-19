// ============================================
// Sistema de Formulários Dinâmicos - Types
// ============================================

/**
 * Todos os tipos de campo disponíveis no sistema de formulários.
 *
 * Cada valor corresponde à string usada no JSON do schema (`tipo`).
 * O renderer usa esse enum para decidir qual componente renderizar.
 */
export enum FieldType {
    /** Campo de texto simples — `<input type="text">` */
    TEXTO = 'texto',

    /** Área de texto multilinha — `<textarea>` */
    TEXTAREA = 'textarea',

    /** Campo numérico — `<input type="number">` */
    NUMBER = 'number',

    /** Campo de e-mail com validação de formato — `<input type="email">` */
    EMAIL = 'email',

    /** Campo de senha com texto mascarado — `<input type="password">` */
    PASSWORD = 'password',

    /**
     * Campo de telefone com máscara automática.
     * Aplica a máscara `(99) 99999-9999` (celular) ou `(99) 9999-9999` (fixo).
     */
    TELEFONE = 'telefone',

    /**
     * Campo de CPF com máscara e validação do dígito verificador.
     * Máscara aplicada: `999.999.999-99`.
     */
    CPF = 'cpf',

    /**
     * Campo de CEP com máscara e busca automática de endereço.
     * Máscara: `99999-999`. Ao preencher, consulta a API ViaCEP e
     * preenche os campos mapeados em `cepFillMap`.
     */
    CEP = 'cep',

    /**
     * Seletor de data — exibe um datepicker.
     * Valor armazenado no formato ISO 8601: `YYYY-MM-DD`.
     * Suporta validações de `minDate`, `maxDate`, `minAge` e `maxAge`.
     */
    DATE = 'date',

    /**
     * Seletor de data e hora.
     * Valor armazenado: `YYYY-MM-DDTHH:mm` (ISO 8601 sem segundos).
     */
    DATETIME = 'datetime',

    /**
     * Seletor apenas de horário.
     * Valor armazenado: `HH:mm`.
     */
    TIME = 'time',

    /**
     * Seletor de intervalo de datas (data inicial + data final).
     * Valor armazenado: `{ start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }`.
     * Use `dateRangeStartLabel` e `dateRangeEndLabel` para customizar os rótulos.
     */
    DATE_RANGE = 'date_range',

    /**
     * Lista suspensa (dropdown) de seleção única.
     * As opções são definidas em `opcoes` ou carregadas via `opcoesFromVar`.
     */
    SELECT = 'select',

    /**
     * Campo de texto com sugestões de autocompletar.
     * Funciona como SELECT mas permite digitar para filtrar.
     * As opções são definidas em `opcoes` ou carregadas via `opcoesFromVar`.
     */
    AUTOCOMPLETE = 'autocomplete',

    /**
     * Grupo de botões de rádio — seleção única.
     * As opções são definidas em `opcoes`.
     * Use `visualStyle: 'card'` para renderizar como cards clicáveis.
     */
    RADIO = 'radio',

    /**
     * Checkbox único — valor booleano.
     * Armazena `true` quando marcado, `false` quando desmarcado.
     */
    CHECKBOX = 'checkbox',

    /**
     * Grupo de checkboxes — seleção múltipla.
     * As opções são definidas em `opcoes`.
     * Valor armazenado: array de strings com os `valor` selecionados.
     */
    CHECKBOX_GROUP = 'checkbox_group',

    /**
     * Toggle switch — alternativa visual ao checkbox.
     * Valor armazenado: `true` (ativo) ou `false` (inativo).
     */
    SWITCH = 'switch',

    /**
     * Controle deslizante para seleção de valor numérico em um intervalo.
     * Configure `minValue`, `maxValue` e `step` para definir o intervalo e incremento.
     */
    SLIDER = 'slider',

    /**
     * Campo de avaliação por estrelas.
     * Valor armazenado: número inteiro de 1 até `maxRating` (padrão: 5).
     */
    RATING = 'rating',

    /**
     * Seletor de cor.
     * Valor armazenado: string hexadecimal, ex: `#3b82f6`.
     */
    COLOR = 'color',

    /**
     * Campo de upload de arquivo.
     * Suporta restrições via `validacao.fileTypes` (MIME types) e `validacao.maxFileSize` (bytes).
     * Valor armazenado: objeto `File` ou URL após upload, dependendo da implementação do renderer.
     */
    FILE = 'file',

    /**
     * Campo oculto — não é renderizado na UI, mas faz parte dos dados do formulário.
     * Use com `initialValue` ou `defaultValue` para enviar valores fixos junto com o submit.
     */
    HIDDEN = 'hidden',

    /**
     * Lista dinâmica de objetos — permite ao usuário adicionar, remover e reordenar itens.
     * Cada item contém os campos definidos em `subFields`.
     * Configure `minItems` e `maxItems` para limitar a quantidade de itens.
     * Use `addLabel` para customizar o texto do botão de adicionar.
     */
    FIELD_ARRAY = 'field_array',

    /**
     * Seleção de tipo de participação em eventos (todos os dias / por dia) e,
     * opcionalmente, sexo (masculino / feminino / misto).
     *
     * Lê dados externos passados via `externalData` do `RendererContext`:
     * `datas`, `valor`, `valorPorDia`, `vagas`, `vagasMasculinas`, `vagasFemininas`.
     *
     * Valor armazenado: `{ tipo: 'todos' | 'porDia', data?: string, genero?: string }`.
     */
    PARTICIPATION_TYPE = 'participation_type',

    /**
     * Seleção de forma de pagamento com cards clicáveis.
     *
     * Observa o campo de tipo de participação (definido em `relatedFieldName`,
     * padrão: `"tipo_participacao"`) para exibir os métodos corretos:
     * - Por dia: PIX, Dinheiro, Cartão de Crédito (3,15%)
     * - Todos os dias: PIX à Vista, PIX Parcelado (7x), Cartão (12,40% / 12x), Dinheiro
     *
     * Valor armazenado: `{ metodo: string, parcelas?: number, valorTotal: number }`.
     */
    PAYMENT_METHOD = 'payment_method',

    /**
     * Aceite de termos e condições.
     * Exibe um modal com texto livre (`termoTexto`) ou PDF embutido
     * (`termoPdfUrl` ou `termoPdfUploadId`).
     * O usuário deve marcar "Li e aceito" para prosseguir.
     *
     * Valor armazenado: `'accepted'` quando aceito, `''` quando não.
     */
    TERMS = 'terms',

    /**
     * Sub-formulário inline — renderiza um grupo de campos aninhados cujos valores
     * ficam em um objeto nested: `{ [fieldNome]: { [subFieldNome]: value } }`.
     *
     * Os campos são definidos em `subSchema.fields`.
     * Use `subSchema.titulo` para exibir um cabeçalho acima do bloco.
     */
    SUB_FORM = 'sub_form',
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Status de ciclo de vida de um schema de formulário.
 */
export enum FormSchemaStatus {
    /** Rascunho — formulário em criação, não visível para o público */
    RASCUNHO = 'rascunho',

    /** Ativo — formulário publicado e aceitando respostas */
    ATIVO = 'ativo',

    /** Inativo — formulário encerrado, não aceita mais respostas */
    INATIVO = 'inativo',
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tipos de máscara disponíveis para campos de texto.
 * Usados em conjunto com `FormField.mascara`.
 */
export enum MaskType {
    /** Máscara de CPF: `999.999.999-99` */
    CPF = 'cpf',

    /** Máscara de telefone: `(99) 99999-9999` */
    TELEFONE = 'telefone',

    /** Máscara de CEP: `99999-999` */
    CEP = 'cep',

    /**
     * Máscara customizada — defina o padrão em `FormField.mascaraCustom`.
     * Usa a sintaxe do `react-imask`: `9` = dígito, `a` = letra, `*` = qualquer.
     */
    CUSTOM = 'custom',
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Uma opção de um campo de seleção (SELECT, RADIO, CHECKBOX_GROUP, AUTOCOMPLETE).
 */
export interface FieldOption {
    /** Valor armazenado no formulário ao selecionar esta opção */
    valor: string;

    /** Texto exibido na UI para esta opção */
    label: string;

    /**
     * Quando `true`, a opção aparece na lista mas não pode ser selecionada.
     * Útil para indicar opções esgotadas ou indisponíveis sem removê-las.
     */
    disabled?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Regras de validação nativas aplicadas pelo renderer antes de submeter o formulário.
 * Para validações customizadas (CPF único, cross-field, etc.), use `FormField.validate`.
 */
export interface FieldValidation {
    /** Número mínimo de caracteres (campos de texto) */
    minLength?: number;

    /** Número máximo de caracteres (campos de texto) */
    maxLength?: number;

    /** Valor numérico mínimo (NUMBER, SLIDER) */
    min?: number;

    /** Valor numérico máximo (NUMBER, SLIDER) */
    max?: number;

    /**
     * Expressão regular para validar o valor.
     * Deve ser uma string de regex válida, ex: `"^[A-Z]{2}[0-9]{6}$"`.
     */
    regex?: string;

    /**
     * Mensagem de erro exibida quando `regex` não é satisfeita.
     * Se omitida, usa uma mensagem genérica.
     */
    regexMessage?: string;

    /**
     * Data mínima permitida no datepicker (DATE, DATETIME).
     * Formato ISO 8601: `YYYY-MM-DD`.
     */
    minDate?: string;

    /**
     * Data máxima permitida no datepicker (DATE, DATETIME).
     * Formato ISO 8601: `YYYY-MM-DD`.
     */
    maxDate?: string;

    /**
     * Lista de MIME types aceitos pelo campo de upload (FILE).
     * Ex: `["image/png", "image/jpeg", "application/pdf"]`.
     * Se omitida, qualquer tipo de arquivo é aceito.
     */
    fileTypes?: string[];

    /**
     * Tamanho máximo do arquivo em bytes (FILE).
     * Ex: `5_242_880` = 5 MB.
     */
    maxFileSize?: number;

    /**
     * Idade mínima em anos completos (DATE).
     * O renderer calcula a idade a partir da data informada e da data atual.
     * Ex: `18` → o usuário precisa ter pelo menos 18 anos.
     */
    minAge?: number;

    /**
     * Idade máxima em anos completos (DATE).
     * Ex: `60` → o usuário pode ter no máximo 60 anos.
     */
    maxAge?: number;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Configuração de um validador customizado referenciado pelo schema.
 *
 * `type` aponta para uma chave no mapa `RendererContext.validatorMapper`.
 * A função validadora recebe `(value, allValues, config)` e retorna
 * `undefined` (válido) ou uma string de erro (inválido). Pode ser assíncrona.
 *
 * Qualquer propriedade adicional é passada como parâmetro para a função.
 *
 * @example
 * ```json
 * { "type": "senhasIguais", "field": "senha", "message": "As senhas não conferem" }
 * ```
 */
export interface FieldValidatorConfig {
    /** Chave do validador registrado em `RendererContext.validatorMapper` */
    type: string;

    /**
     * Mensagem de erro que sobrescreve a retornada pela função validadora.
     * Útil para customizar a mensagem sem criar um validador separado.
     */
    message?: string;

    /**
     * Parâmetros extras passados como terceiro argumento para a função validadora.
     * Ex: `{ "field": "confirmacaoSenha" }` para validação cross-field.
     */
    [key: string]: unknown;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Definição dos campos de um sub-formulário inline (FieldType.SUB_FORM).
 * Os valores ficam aninhados: `{ [nomeDoFieldPai]: { [nomeDoCampo]: valor } }`.
 */
export interface SubFormSchema {
    /**
     * Título exibido no cabeçalho do bloco do sub-formulário.
     * Se omitido, nenhum cabeçalho é renderizado.
     */
    titulo?: string;

    /** Lista de campos do sub-formulário. Segue as mesmas regras de `FormField`. */
    fields: FormField[];
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Uma condição simples (folha) que compara o valor de um campo com um valor esperado.
 *
 * Duck typing: se o objeto tiver `campoId`, é uma folha.
 * Se tiver `and` ou `or`, é um `FieldConditionGroup`.
 */
export interface FieldConditional {
    /**
     * `nome` (chave no form) do campo a ser observado.
     * Dentro de containers repetíveis, use o nome sem o prefixo de índice —
     * o renderer resolve o caminho completo automaticamente.
     */
    campoId: string;

    /**
     * Operador de comparação:
     * - `igual` / `diferente` — igualdade exata
     * - `contem` / `naoContem` — o valor inclui a substring/item
     * - `vazio` / `naoVazio` — checa se o campo tem valor (ignora `valor`)
     * - `maiorQue` / `menorQue` / `maiorOuIgual` / `menorOuIgual` — comparação numérica ou de datas
     */
    operador:
    | 'igual'
    | 'diferente'
    | 'contem'
    | 'naoContem'
    | 'vazio'
    | 'naoVazio'
    | 'maiorQue'
    | 'menorQue'
    | 'maiorOuIgual'
    | 'menorOuIgual';

    /**
     * Valor a comparar com o conteúdo do campo.
     * Não necessário para os operadores `vazio` e `naoVazio`.
     */
    valor?: string | number | boolean;

    /**
     * De onde vem o valor observado:
     * - `'campo'` (padrão) — valor atual de outro campo do formulário
     * - `'evento'` — valor vindo de `externalData` do `RendererContext`
     */
    source?: 'campo' | 'evento';
}

/**
 * Grupo lógico de condicionais que combina múltiplas expressões.
 *
 * - `and: [...]` → **todas** as expressões devem ser verdadeiras
 * - `or: [...]`  → **pelo menos uma** deve ser verdadeira
 *
 * Os itens podem ser `FieldConditional` (folha) ou outro `FieldConditionGroup` (recursivo),
 * permitindo lógicas complexas como `(A AND B) OR (C AND D)`.
 *
 * @example
 * ```ts
 * // Exibe o campo se o usuário for admin OU (editor ativo)
 * {
 *   or: [
 *     { campoId: 'role', operador: 'igual', valor: 'admin' },
 *     {
 *       and: [
 *         { campoId: 'role',  operador: 'igual', valor: 'editor' },
 *         { campoId: 'ativo', operador: 'igual', valor: true },
 *       ],
 *     },
 *   ],
 * }
 * ```
 */
export interface FieldConditionGroup {
    /** Todas as expressões do array devem ser verdadeiras (AND lógico) */
    and?: FieldConditionalExpr[];

    /** Pelo menos uma expressão do array deve ser verdadeira (OR lógico) */
    or?: FieldConditionalExpr[];
}

/**
 * União de uma condição simples (folha) ou grupo lógico (nó).
 * Duck typing: `'campoId' in expr` → folha; `'and' in expr || 'or' in expr` → grupo.
 */
export type FieldConditionalExpr = FieldConditional | FieldConditionGroup;

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Define um valor a ser injetado em outro campo quando a condicional do campo atual
 * transicionar de `false → true`.
 *
 * Útil para pré-preencher campos dependentes, como setar o estado ao escolher uma cidade.
 */
export interface ConditionalSetValue {
    /**
     * `nome` (chave no form) do campo alvo que receberá o valor.
     * Dentro de containers repetíveis, informe apenas o nome local
     * (sem prefixo de índice).
     */
    campo: string;

    /**
     * Valor a setar no campo alvo.
     * - Use `null` para limpar o valor do campo.
     * - Suporta interpolação via template vars: `"{{evento.cidade}}"`.
     */
    valor: string | number | boolean | null;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Definição completa de um campo dentro de um `FormContainer`.
 *
 * Campos são o átomo do sistema — cada `FormField` corresponde a um controle
 * na UI e a uma chave no objeto de valores do formulário.
 */
export interface FormField {
    /** Identificador único do campo dentro do schema. Gerado via `generateId()`. */
    id: string;

    /**
     * Chave do campo no objeto de valores do formulário (equivalente ao `name` do HTML).
     * Deve ser único dentro do step. Use snake_case.
     * Ex: `"nome_completo"`, `"data_nascimento"`.
     */
    nome: string;

    /** Rótulo visível ao usuário, exibido acima do campo. */
    label: string;

    /** Tipo do campo — determina qual componente o renderer vai usar. Ver `FieldType`. */
    tipo: FieldType;

    /**
     * Se `true`, o campo é obrigatório e o formulário não pode ser submetido sem valor.
     * A mensagem de erro padrão é "Campo obrigatório".
     */
    obrigatorio: boolean;

    /**
     * Largura do campo em colunas de uma grade de 12 colunas.
     * Ex: `12` = largura total, `6` = metade, `4` = um terço.
     * O renderer respeita o `colunas` do container pai.
     */
    tamanho: number;

    /**
     * Coluna de início na grade (1-indexed).
     * Use para criar layouts com "lacunas" ou para forçar o campo a começar
     * em uma coluna específica.
     */
    inicioColuna?: number;

    /**
     * Posição do campo dentro do container — define a ordem de renderização.
     * Campos são ordenados de forma ascendente por este valor.
     */
    ordem: number;

    /** Texto exibido dentro do campo quando vazio (hint de preenchimento). */
    placeholder?: string;

    /**
     * Texto de ajuda exibido abaixo do campo (menor e mais discreto que o label).
     * Útil para instruções complementares, ex: "Use o formato DD/MM/AAAA".
     */
    hint?: string;

    /**
     * Valor padrão estático aplicado na inicialização do formulário.
     * Mantido para compatibilidade com schemas antigos.
     * Prefira `initialValue` para novos schemas — ele suporta interpolação.
     */
    defaultValue?: string | number | boolean;

    /**
     * Opções disponíveis para campos de seleção: SELECT, RADIO, CHECKBOX_GROUP, AUTOCOMPLETE.
     * Alternativa dinâmica: use `opcoesFromVar` para referenciar uma variável do contexto.
     */
    opcoes?: FieldOption[];

    /** Regras de validação nativas do renderer. Para validações customizadas, use `validate`. */
    validacao?: FieldValidation;

    /**
     * Validadores customizados **bloqueantes** — executados após as regras de `validacao`.
     * Se qualquer validador retornar uma mensagem de erro, o submit é bloqueado.
     * As funções são registradas em `RendererContext.validatorMapper`.
     * Suportam validação assíncrona (retornam `Promise<string | undefined>`).
     *
     * @example
     * ```json
     * [
     *   { "type": "cpfUnico", "message": "CPF já cadastrado" },
     *   { "type": "maiorDeIdade" }
     * ]
     * ```
     */
    validate?: FieldValidatorConfig[];

    /**
     * Validadores de **aviso** — mesma assinatura que `validate`, mas não bloqueiam o submit.
     * As mensagens ficam disponíveis em `RendererContext.fieldWarnings[campo]`
     * para exibição visual sem impedir o envio.
     */
    warn?: FieldValidatorConfig[];

    /**
     * Expressão condicional que controla a visibilidade do campo.
     * Quando a condição é `false`, o campo é ocultado (e seu valor pode ser
     * limpo via `clearedValue`).
     */
    condicional?: FieldConditionalExpr;

    /**
     * Valores a injetar em outros campos quando esta condicional transicionar
     * de `false → true`. Executado uma vez por transição.
     * Ver `ConditionalSetValue`.
     */
    setValues?: ConditionalSetValue[];

    /**
     * Tipo de máscara de input a aplicar.
     * Para máscara personalizada, defina `MaskType.CUSTOM` e configure `mascaraCustom`.
     */
    mascara?: MaskType;

    /**
     * Padrão de máscara customizada (apenas quando `mascara === MaskType.CUSTOM`).
     * Usa sintaxe do `react-imask`: `9` = dígito, `a` = letra, `*` = qualquer.
     * Ex: `"99/99/9999"` para datas no formato BR.
     */
    mascaraCustom?: string;

    /**
     * Texto dos termos e condições exibido no modal (FieldType.TERMS).
     * Use esta prop para textos curtos. Para documentos longos, prefira `termoPdfUrl`.
     */
    termoTexto?: string;

    /**
     * URL pública do PDF de termos exibido em iframe no modal (FieldType.TERMS).
     * Tem precedência sobre `termoTexto` quando ambos estiverem definidos.
     */
    termoPdfUrl?: string;

    /**
     * ID de upload do PDF de termos armazenado no sistema interno (FieldType.TERMS).
     * O renderer resolve a URL a partir deste ID via o serviço de storage configurado.
     */
    termoPdfUploadId?: string;

    /**
     * Quando `true`, o campo está "travado" na interface do builder e não pode ser
     * movido, deletado ou reordenado pelo usuário. Não afeta a renderização do form.
     */
    locked?: boolean;

    /**
     * Quando `true`, o campo é exibido porém não editável pelo usuário.
     * Diferente de `isDisabled`: o valor é incluído no submit e o campo recebe
     * estilo visual de leitura.
     */
    isReadOnly?: boolean;

    /**
     * Quando `true`, o campo é exibido mas desabilitado — não interativo e
     * com estilo visual esmaecido. O valor ainda é incluído no submit.
     */
    isDisabled?: boolean;

    /**
     * Valor aplicado ao campo quando ele se torna invisível por uma condicional.
     * - `null` → limpa o valor (campo volta para `undefined` / vazio)
     * - qualquer primitivo → seta este valor quando o campo é ocultado
     *
     * Se omitido, o valor do campo é preservado mesmo quando oculto.
     */
    clearedValue?: string | number | boolean | null;

    /**
     * Valor inicial resolvido em runtime — tem precedência sobre `defaultValue`.
     * Suporta interpolação de variáveis do `externalData`: `"{{evento.nome}}"`.
     *
     * @example
     * ```json
     * { "initialValue": "{{evento.cidade}}" }
     * ```
     */
    initialValue?: string | number | boolean;

    /**
     * Chave de um resolver registrado em `RendererContext.fieldResolvers`.
     * O resolver recebe `(field, formValues, externalData)` e retorna `Partial<FormField>`
     * que é mesclado sobre este field antes da renderização.
     *
     * Use para props dinâmicas: opções carregadas por API, `disabled` condicional,
     * `placeholder` calculado a partir de outros campos, etc.
     */
    resolvePropsKey?: string;

    /** Definição do sub-formulário inline (somente para `FieldType.SUB_FORM`). */
    subSchema?: SubFormSchema;

    /**
     * Estilo visual alternativo para campos de seleção (RADIO, CHECKBOX_GROUP).
     * - `'default'` — aparência padrão de radio/checkbox
     * - `'card'` — cada opção renderiza como um card clicável
     */
    visualStyle?: 'default' | 'card';

    /**
     * Campos de cada item da lista dinâmica (somente para `FieldType.FIELD_ARRAY`).
     * Segue a mesma estrutura de `FormField[]`. Os valores ficam em:
     * `{ [nomeDoCampo]: [{ [subFieldNome]: valor }, ...] }`.
     */
    subFields?: FormField[];

    /**
     * Rótulo exibido em cada item da lista para identificá-lo (FIELD_ARRAY, container repetível).
     * Ex: `"Contato"` → "Contato 1", "Contato 2", etc.
     */
    itemLabel?: string;

    /**
     * Número mínimo de itens obrigatórios (FIELD_ARRAY, container repetível).
     * O formulário não pode ser submetido com menos itens que este valor.
     */
    minItems?: number;

    /**
     * Número máximo de itens permitidos (FIELD_ARRAY, container repetível).
     * O botão de adicionar fica desabilitado ao atingir este limite.
     */
    maxItems?: number;

    /**
     * Texto do botão de adicionar novo item (FIELD_ARRAY).
     * Ex: `"+ Adicionar endereço"`. Se omitido, usa `"+ Adicionar item"`.
     */
    addLabel?: string;

    /**
     * Nome de uma variável do contexto do formulário que contém as opções do campo.
     * Alternativa a `opcoes` para opções carregadas dinamicamente.
     * Ex: `"estadosBrasileiros"` — o renderer busca `formContext.estadosBrasileiros`.
     */
    opcoesFromVar?: string;

    /**
     * Incremento do controle (SLIDER, NUMBER).
     * Ex: `5` → o slider avança de 5 em 5; `0.1` → aceita uma casa decimal.
     */
    step?: number;

    /** Valor mínimo do controle (SLIDER). */
    minValue?: number;

    /** Valor máximo do controle (SLIDER). */
    maxValue?: number;

    /**
     * Quantidade máxima de estrelas exibidas no campo de avaliação (RATING).
     * Padrão: `5`.
     */
    maxRating?: number;

    /**
     * Rótulo do campo de data inicial no seletor de intervalo (DATE_RANGE).
     * Ex: `"Check-in"`. Se omitido, usa `"Data inicial"`.
     */
    dateRangeStartLabel?: string;

    /**
     * Rótulo do campo de data final no seletor de intervalo (DATE_RANGE).
     * Ex: `"Check-out"`. Se omitido, usa `"Data final"`.
     */
    dateRangeEndLabel?: string;

    /**
     * Mapeamento dos dados retornados pela API de CEP para os campos do formulário (CEP).
     * As chaves são os nomes dos dados do CEP; os valores são os `nome` dos campos alvo.
     *
     * Quando omitido, usa os nomes fixos do preset de endereço:
     * `_address_logradouro`, `_address_bairro`, `_address_cidade`, `_address_estado`.
     *
     * Em containers repetíveis, o prefixo de índice (ex: `enderecos.0.`) é aplicado
     * automaticamente pelo renderer — informe apenas o nome local do campo.
     *
     * @example
     * ```json
     * {
     *   "logradouro": "rua",
     *   "bairro": "bairro",
     *   "cidade": "municipio",
     *   "estado": "uf"
     * }
     * ```
     */
    cepFillMap?: {
        /** Campo do formulário que receberá o logradouro (rua/avenida) retornado pelo CEP */
        logradouro?: string;
        /** Campo do formulário que receberá o bairro retornado pelo CEP */
        bairro?: string;
        /** Campo do formulário que receberá a cidade (município) retornada pelo CEP */
        cidade?: string;
        /** Campo do formulário que receberá a sigla do estado (UF) retornada pelo CEP */
        estado?: string;
    };

    /**
     * Nome do campo que contém o tipo de participação, observado via `useWatch`
     * pelo componente PAYMENT_METHOD para exibir os métodos corretos.
     *
     * Padrão: `"tipo_participacao"`.
     *
     * @example
     * ```json
     * { "tipo": "payment_method", "relatedFieldName": "participacao_escolhida" }
     * ```
     */
    relatedFieldName?: string;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Contêiner de layout que agrupa campos dentro de um `FormStep`.
 *
 * O container define a grade de colunas e pode ser configurado como repetível,
 * permitindo que o usuário adicione múltiplos grupos de campos (ex: lista de contatos).
 */
export interface FormContainer {
    /** Identificador único do container dentro do schema. Gerado via `generateId()`. */
    id: string;

    /**
     * Identificador interno do container (usado pelo builder, não exibido na UI do form).
     * Diferente de `titulo` — é um nome técnico para fins de referência.
     */
    nome?: string;

    /** Título exibido no cabeçalho visual do container na UI do formulário. */
    titulo: string;

    /** Descrição exibida abaixo do título, com texto complementar sobre o bloco. */
    descricao?: string;

    /**
     * Nome do ícone Lucide exibido ao lado do título do container.
     * Ex: `"User"`, `"MapPin"`, `"CreditCard"`.
     */
    icone?: string;

    /**
     * Posição do container dentro do step — define a ordem de renderização.
     * Containers são ordenados de forma ascendente por este valor.
     */
    ordem: number;

    /**
     * Número de colunas da grade interna do container.
     * Os campos distribuem seus `tamanho` dentro desta grade.
     * - `1` → layout de coluna única (stack vertical)
     * - `2` → dois campos por linha
     * - `3` → três campos por linha
     * - `4` → quatro campos por linha
     */
    colunas?: 1 | 2 | 3 | 4;

    /**
     * Largura do container em colunas da grade do step (análogo ao `tamanho` do campo).
     * Use para criar layouts com containers lado a lado.
     */
    tamanho?: number;

    /**
     * Coluna de início do container na grade do step (1-indexed).
     * Use para empurrar o container para uma coluna específica.
     */
    inicioColuna?: number;

    /**
     * Quando `false`, oculta o título do container na UI do form.
     * Padrão implícito: `true`.
     */
    showLabel?: boolean;

    /**
     * Quando `true`, renderiza o container com estilo de card (borda + fundo elevado).
     * Independente do `containerStyle` global do template.
     */
    showAsCard?: boolean;

    /**
     * Quando `true`, transforma o container em uma lista dinâmica.
     * O usuário pode adicionar, remover e reordenar itens — cada item
     * é um grupo com os campos de `campos`.
     * Configure `minItems` e `maxItems` para limitar a quantidade.
     */
    repeatable?: boolean;

    /**
     * Número mínimo de itens obrigatórios quando `repeatable: true`.
     * O formulário não pode ser submetido com menos itens.
     */
    minItems?: number;

    /**
     * Número máximo de itens permitidos quando `repeatable: true`.
     * O botão de adicionar fica desabilitado ao atingir este limite.
     */
    maxItems?: number;

    /**
     * Rótulo exibido em cada item da lista repetível para identificá-lo.
     * Ex: `"Contato"` → "Contato 1", "Contato 2", etc.
     */
    itemLabel?: string;

    /**
     * Expressão condicional que controla a visibilidade do container inteiro.
     * Quando `false`, todos os campos do container são ocultados e seus
     * valores não são incluídos no submit.
     */
    condicional?: FieldConditionalExpr;

    /** Lista de campos do container, ordenada por `FormField.ordem`. */
    campos: FormField[];
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Uma etapa (página) do formulário multi-step.
 *
 * O formulário exibe um step por vez. A navegação entre steps é controlada
 * pelo renderer conforme o `stepNavigation` do template (`wizard`, `tabs`, `vertical`).
 */
export interface FormStep {
    /** Identificador único do step dentro do schema. Gerado via `generateId()`. */
    id: string;

    /** Título do step exibido no indicador de progresso e no cabeçalho. */
    titulo: string;

    /** Descrição opcional exibida abaixo do título do step. */
    descricao?: string;

    /**
     * Nome do ícone Lucide exibido no indicador de step.
     * Ex: `"User"`, `"MapPin"`, `"CreditCard"`.
     * Necessário quando `stepIndicatorVariant` é `"icons"` ou `"icons-labeled"`.
     */
    icone?: string;

    /**
     * Posição do step no fluxo do formulário — define a ordem de navegação.
     * Steps são ordenados de forma ascendente por este valor.
     */
    ordem: number;

    /**
     * Quando `false`, oculta o título do step na UI do form.
     * Padrão implícito: `true`.
     */
    showLabel?: boolean;

    /** Lista de containers do step, ordenada por `FormContainer.ordem`. */
    containers: FormContainer[];
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Schema completo de um formulário dinâmico.
 *
 * É o documento raiz — contém todas as definições de steps, containers e campos,
 * além dos metadados de ciclo de vida. É este objeto que é persistido no banco
 * e carregado pelo renderer para montar o formulário.
 */
export interface FormSchema {
    /** Identificador único do formulário. Gerado via `generateId()`. */
    id: string;

    /** Nome interno do formulário (visível no builder e nos listagens). */
    nome: string;

    /** Descrição opcional do formulário (visível no builder). */
    descricao?: string;

    /**
     * ID do evento ao qual este formulário está vinculado.
     * `null` indica formulário desvinculado (standalone).
     */
    eventoId?: string | null;

    /** Status de publicação do formulário. Ver `FormSchemaStatus`. */
    status: FormSchemaStatus;

    /**
     * ID do template visual aplicado ao formulário.
     * Referencia um `FormTemplateConfig.id` registrado no renderer.
     * `null` usa o template padrão do sistema.
     */
    template?: string | null;

    /**
     * Configurações do indicador de steps específicas deste formulário.
     * Sobrescreve os valores definidos pelo template selecionado.
     * Campos omitidos herdam o valor do template.
     * Ver `FormStepConfig`.
     */
    stepConfig?: import('./formTemplate').FormStepConfig;

    /** Lista de steps do formulário, ordenada por `FormStep.ordem`. */
    steps: FormStep[];

    /** Data de criação do schema (ISO 8601). Preenchida automaticamente pelo backend. */
    createdAt?: string;

    /** Data da última atualização do schema (ISO 8601). Preenchida automaticamente pelo backend. */
    updatedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mapa de rótulos legíveis para cada `FieldType`.
 * Usado pelo builder para exibir o nome amigável do tipo na UI.
 *
 * É um `Record<FieldType, string>` exaustivo — o TypeScript garante que
 * todo novo valor adicionado ao enum deve ser incluído aqui.
 */
export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
    [FieldType.TEXTO]: 'Texto',
    [FieldType.TEXTAREA]: 'Área de texto',
    [FieldType.NUMBER]: 'Número',
    [FieldType.EMAIL]: 'E-mail',
    [FieldType.PASSWORD]: 'Senha',
    [FieldType.TELEFONE]: 'Telefone',
    [FieldType.CPF]: 'CPF',
    [FieldType.CEP]: 'CEP',
    [FieldType.DATE]: 'Data',
    [FieldType.DATETIME]: 'Data e hora',
    [FieldType.TIME]: 'Horário',
    [FieldType.DATE_RANGE]: 'Período (data inicial/final)',
    [FieldType.SELECT]: 'Seleção',
    [FieldType.AUTOCOMPLETE]: 'Autocomplete',
    [FieldType.RADIO]: 'Radio',
    [FieldType.CHECKBOX]: 'Checkbox',
    [FieldType.CHECKBOX_GROUP]: 'Grupo de checkboxes',
    [FieldType.SWITCH]: 'Switch (toggle)',
    [FieldType.SLIDER]: 'Slider',
    [FieldType.RATING]: 'Avaliação (estrelas)',
    [FieldType.COLOR]: 'Cor',
    [FieldType.FILE]: 'Arquivo',
    [FieldType.HIDDEN]: 'Oculto',
    [FieldType.FIELD_ARRAY]: 'Lista de itens',
    [FieldType.PARTICIPATION_TYPE]: 'Tipo de participação',
    [FieldType.PAYMENT_METHOD]: 'Forma de pagamento',
    [FieldType.TERMS]: 'Termos e condições',
    [FieldType.SUB_FORM]: 'Sub-formulário',
};

/**
 * Mapa de nomes de ícones Lucide para cada `FieldType`.
 * Usado pelo builder na paleta de tipos de campo e no painel de propriedades.
 *
 * Todos os valores seguem a convenção PascalCase do Lucide React.
 * É um `Record<FieldType, string>` exaustivo.
 */
export const FIELD_TYPE_ICONS: Record<FieldType, string> = {
    [FieldType.TEXTO]: 'Type',
    [FieldType.TEXTAREA]: 'AlignLeft',
    [FieldType.NUMBER]: 'Hash',
    [FieldType.EMAIL]: 'Mail',
    [FieldType.PASSWORD]: 'Lock',
    [FieldType.TELEFONE]: 'Phone',
    [FieldType.CPF]: 'CreditCard',
    [FieldType.CEP]: 'MapPin',
    [FieldType.DATE]: 'Calendar',
    [FieldType.DATETIME]: 'Clock',
    [FieldType.TIME]: 'Timer',
    [FieldType.DATE_RANGE]: 'CalendarRange',
    [FieldType.SELECT]: 'ChevronDown',
    [FieldType.AUTOCOMPLETE]: 'Search',
    [FieldType.RADIO]: 'CircleDot',
    [FieldType.CHECKBOX]: 'CheckSquare',
    [FieldType.CHECKBOX_GROUP]: 'ListChecks',
    [FieldType.SWITCH]: 'ToggleLeft',
    [FieldType.SLIDER]: 'SlidersHorizontal',
    [FieldType.RATING]: 'Star',
    [FieldType.COLOR]: 'Palette',
    [FieldType.FILE]: 'Upload',
    [FieldType.HIDDEN]: 'EyeOff',
    [FieldType.FIELD_ARRAY]: 'List',
    [FieldType.PARTICIPATION_TYPE]: 'CalendarDays',
    [FieldType.PAYMENT_METHOD]: 'Wallet',
    [FieldType.TERMS]: 'ScrollText',
    [FieldType.SUB_FORM]: 'LayoutList',
};