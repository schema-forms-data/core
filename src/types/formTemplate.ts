// ============================================
// Sistema de Templates de Formulário
// ============================================

import type { FormContainer, FormField } from './formSchema';

// ─────────────────────────────────────────────────────────────────────────────
// Cores
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Paleta de cores CSS de um template de formulário.
 * Todos os valores devem ser strings CSS válidas: hex, rgb, hsl, var(--...), etc.
 *
 * O renderer injeta essas cores como variáveis CSS no elemento raiz do formulário,
 * permitindo que os componentes as referenciem via `var(--sf-primary)`, etc.
 */
export interface FormTemplateColors {
    /**
     * Cor principal do tema — usada em botões primários, bordas de foco,
     * indicadores de step ativo e outros elementos de destaque.
     * Ex: `"#3b82f6"` (azul), `"#8b5cf6"` (violeta).
     */
    primary: string;

    /**
     * Variação mais escura da cor primária, aplicada no estado `hover` de botões
     * e elementos interativos.
     * Ex: `"#2563eb"` para um hover do `#3b82f6`.
     */
    primaryHover: string;

    /**
     * Cor de destaque secundária, usada em badges, tags e elementos auxiliares
     * que precisam contrastar com a cor primária.
     * Ex: `"#f59e0b"` (âmbar).
     */
    accent: string;

    /**
     * Cor de fundo da página ou do wrapper externo do formulário.
     * Ex: `"#ffffff"`, `"#f1f5f9"`.
     */
    background: string;

    /**
     * Cor de fundo de superfícies elevadas: cards, containers, inputs.
     * Ligeiramente diferente de `background` para criar profundidade visual.
     * Ex: `"#f8fafc"`, `"rgba(255,255,255,0.8)"` para efeito glassmorphism.
     */
    surface: string;

    /**
     * Cor do texto principal — labels, títulos, valores de campos.
     * Deve ter contraste adequado (WCAG AA) sobre `surface` e `background`.
     * Ex: `"#1e293b"`.
     */
    text: string;

    /**
     * Cor do texto secundário — hints, descrições, placeholders, labels de step.
     * Menos proeminente que `text`, mas ainda legível.
     * Ex: `"#64748b"`.
     */
    textMuted: string;

    /**
     * Cor das bordas de inputs, separadores e contornos de cards.
     * Ex: `"#e2e8f0"`.
     */
    border: string;

    /**
     * Cor usada em mensagens de erro de validação, bordas de campos inválidos
     * e ícones de alerta.
     * Ex: `"#ef4444"` (vermelho).
     */
    error: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout — tipos
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Modo de navegação entre os steps do formulário.
 *
 * - `'wizard'`   — exibe um step por vez com botões "Anterior" / "Próximo"
 * - `'tabs'`     — exibe abas clicáveis no topo para navegar livremente entre steps
 * - `'vertical'` — exibe todos os steps empilhados verticalmente em scroll contínuo
 */
export type StepNavigation = 'wizard' | 'tabs' | 'vertical';

/**
 * Estilo visual dos containers (blocos de campos) dentro do formulário.
 *
 * - `'card'`           — container com fundo, borda e sombra leve
 * - `'glassmorphism'`  — fundo semi-transparente com desfoque (`backdrop-filter: blur`)
 * - `'flat'`           — sem borda ou fundo visível (apenas espaçamento)
 * - `'bordered'`       — apenas borda, sem fundo diferenciado
 */
export type ContainerStyle = 'card' | 'glassmorphism' | 'flat' | 'bordered';

/**
 * Espaçamento interno dos containers e entre os campos.
 *
 * - `'compact'`  — pouco espaço, ideal para formulários densos ou mobile
 * - `'normal'`   — espaçamento padrão equilibrado
 * - `'relaxed'`  — mais espaço, ideal para formulários com poucos campos
 */
export type SpacingSize = 'compact' | 'normal' | 'relaxed';

/**
 * Variante visual do indicador de progresso de steps.
 *
 * - `'numbers'`       — círculos com o número do step (ex: 1, 2, 3)
 * - `'icons'`         — círculos com o ícone definido em `FormStep.icone`
 * - `'icons-labeled'` — ícone + rótulo textual abaixo de cada step
 */
export type StepIndicatorVariant = 'numbers' | 'icons' | 'icons-labeled';

/**
 * Alinhamento horizontal do bloco de indicadores de step.
 *
 * - `'top-center'` — centralizado horizontalmente no topo do formulário
 * - `'top-left'`   — alinhado à esquerda no topo
 */
export type StepIndicatorPosition = 'top-center' | 'top-left';

/**
 * Orientação do indicador de progresso dos steps.
 *
 * - `'horizontal'` — steps dispostos em linha (padrão para wizard)
 * - `'vertical'`   — steps dispostos em coluna (padrão para sidebar lateral)
 */
export type StepIndicatorOrientation = 'horizontal' | 'vertical';

/**
 * Estilo de exibição do título do evento no formulário.
 *
 * - `'bar'`    — barra de destaque colorida com o título no topo
 * - `'inline'` — título exibido inline acima do primeiro step, sem barra
 * - `'hidden'` — título não exibido no formulário
 */
export type EventTitleStyle = 'bar' | 'inline' | 'hidden';

// ─────────────────────────────────────────────────────────────────────────────
// Step config override — nível do FormSchema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Configurações do indicador de steps que podem ser sobrescritas por formulário,
 * independentemente do template visual selecionado.
 *
 * O template define os valores padrão; qualquer campo definido aqui tem precedência.
 * Campos omitidos herdam o valor do template.
 *
 * @example
 * ```ts
 * // Usa o template "moderno" (numbers + horizontal por padrão),
 * // mas sobrescreve para icons-labeled + vertical neste formulário específico.
 * const schema: FormSchema = {
 *   template: 'moderno',
 *   stepConfig: {
 *     stepIndicatorVariant: 'icons-labeled',
 *     stepIndicatorOrientation: 'vertical',
 *   },
 *   steps: [...],
 * };
 * ```
 */
export interface FormStepConfig {
    /** Exibe ou oculta o indicador de steps. Sobrescreve `FormTemplateLayout.showStepIndicators`. */
    showStepIndicators?: boolean;

    /** Exibe ou oculta a barra de progresso linear. Sobrescreve `FormTemplateLayout.showProgressBar`. */
    showProgressBar?: boolean;

    /** Variante visual do indicador. Sobrescreve `FormTemplateLayout.stepIndicatorVariant`. */
    stepIndicatorVariant?: StepIndicatorVariant;

    /** Posição horizontal do indicador. Sobrescreve `FormTemplateLayout.stepIndicatorPosition`. */
    stepIndicatorPosition?: StepIndicatorPosition;

    /** Orientação do indicador (horizontal / vertical). Sobrescreve `FormTemplateLayout.stepIndicatorOrientation`. */
    stepIndicatorOrientation?: StepIndicatorOrientation;
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout — interface
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Configuração de layout e navegação do formulário.
 * Controla como os steps são apresentados, espaçados e decorados.
 */
export interface FormTemplateLayout {
    /**
     * Modo de navegação entre steps.
     * Ver tipo `StepNavigation` para detalhes de cada opção.
     */
    stepNavigation: StepNavigation;

    /**
     * Estilo visual dos containers de campos.
     * Ver tipo `ContainerStyle` para detalhes de cada opção.
     */
    containerStyle: ContainerStyle;

    /**
     * Densidade de espaçamento interno dos containers e entre campos.
     * Ver tipo `SpacingSize` para detalhes de cada opção.
     */
    spacing: SpacingSize;

    /**
     * Raio de arredondamento de bordas aplicado globalmente nos componentes do form.
     * Aceita qualquer valor CSS válido: `"0"`, `"0.5rem"`, `"12px"`, `"9999px"` (pill).
     */
    roundness: string;

    /**
     * Quando `true`, exibe uma barra de progresso linear no topo do formulário
     * indicando o percentual de steps concluídos.
     */
    showProgressBar: boolean;

    /**
     * Quando `true`, exibe o indicador de steps (números, ícones ou ícones com rótulo)
     * conforme configurado em `stepIndicatorVariant` e `stepIndicatorPosition`.
     */
    showStepIndicators: boolean;

    /**
     * Variante visual do indicador de steps.
     * Relevante apenas quando `showStepIndicators: true`.
     * Ver tipo `StepIndicatorVariant`.
     */
    stepIndicatorVariant?: StepIndicatorVariant;

    /**
     * Posicionamento horizontal do bloco de indicadores de step.
     * Relevante apenas quando `showStepIndicators: true`.
     * Ver tipo `StepIndicatorPosition`.
     */
    stepIndicatorPosition?: StepIndicatorPosition;

    /**
     * Orientação do indicador de steps (horizontal ou vertical).
     * Use `'vertical'` para layouts com sidebar lateral de navegação.
     * Ver tipo `StepIndicatorOrientation`.
     */
    stepIndicatorOrientation?: StepIndicatorOrientation;

    /**
     * Como o título do evento é exibido no formulário.
     * Ver tipo `EventTitleStyle`.
     */
    eventTitleStyle?: EventTitleStyle;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tipografia
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Configuração tipográfica do template.
 * As classes devem ser classes CSS/Tailwind válidas aplicadas nos elementos correspondentes.
 */
export interface FormTemplateTypography {
    /**
     * Família de fontes aplicada globalmente no formulário.
     * Valor CSS direto para `font-family`.
     * Ex: `"'Inter', sans-serif"`, `"'Roboto', 'Helvetica Neue', sans-serif"`.
     */
    fontFamily: string;

    /**
     * Classes CSS aplicadas no `<h2>` do título de cada step.
     * Ex: `"text-2xl font-bold text-gray-900"`.
     */
    stepTitleClass: string;

    /**
     * Classes CSS aplicadas no `<p>` da descrição de cada step.
     * Ex: `"text-sm text-gray-500 mt-1"`.
     */
    stepDescClass: string;

    /**
     * Classes CSS aplicadas em todos os `<label>` de campos do formulário.
     * Ex: `"text-sm font-medium text-gray-700"`.
     */
    labelClass: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template completo
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Configuração completa de um template visual para o formulário.
 *
 * Um template define a identidade visual — cores, layout, espaçamento e tipografia.
 * Templates são registrados no renderer e referenciados pelo `FormSchema.template`.
 *
 * @example
 * ```ts
 * const darkTemplate: FormTemplateConfig = {
 *   id: 'dark',
 *   displayName: 'Dark Mode',
 *   colors: { primary: '#818cf8', background: '#0f172a', ... },
 *   layout: { stepNavigation: 'wizard', containerStyle: 'card', ... },
 * };
 * ```
 */
export interface FormTemplateConfig {
    /**
     * Identificador único do template.
     * Referenciado por `FormSchema.template`.
     * Use kebab-case: `"default"`, `"dark"`, `"minimal-light"`.
     */
    id: string;

    /**
     * Nome legível do template exibido no seletor de templates do builder.
     * Ex: `"Dark Mode"`, `"Claro Minimalista"`.
     */
    displayName: string;

    /** Paleta de cores do template. Ver `FormTemplateColors`. */
    colors: FormTemplateColors;

    /** Configurações de layout e navegação. Ver `FormTemplateLayout`. */
    layout: FormTemplateLayout;

    /** Configuração tipográfica opcional. Se omitida, usa as fontes padrão do CSS. */
    typography?: FormTemplateTypography;

    /**
     * Classe(s) CSS aplicadas no elemento wrapper externo do formulário.
     * Útil para definir largura máxima, centralização ou padding.
     * Ex: `"max-w-2xl mx-auto px-4"`.
     */
    wrapperClass?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Blocos pré-configurados (Presets)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Categoria temática de um bloco preset.
 * Usada para agrupar e filtrar os presets na biblioteca do builder.
 *
 * - `'personal'`   — dados pessoais (nome, CPF, data de nascimento, etc.)
 * - `'address'`    — endereço completo com busca por CEP
 * - `'health'`     — saúde (tipo sanguíneo, alergias, plano de saúde, etc.)
 * - `'event'`      — dados específicos de inscrição em evento
 * - `'payment'`    — forma de pagamento e dados financeiros
 * - `'emergency'`  — contato de emergência
 */
export type PresetBlockCategory =
    | 'personal'
    | 'address'
    | 'health'
    | 'event'
    | 'payment'
    | 'emergency';

/**
 * Um bloco de container pré-configurado disponível na biblioteca do builder.
 *
 * Presets são atalhos que inserem um `FormContainer` completo com campos
 * já configurados — o usuário pode inserir, personalizar ou remover campos
 * depois.
 */
export interface PresetBlock {
    /**
     * Identificador único do preset.
     * Ex: `"personal-basic"`, `"address-full"`.
     */
    id: string;

    /** Nome exibido na biblioteca de presets do builder. Ex: `"Dados Pessoais Básicos"`. */
    name: string;

    /** Descrição breve do conteúdo do preset, exibida como tooltip ou subtítulo. */
    description: string;

    /**
     * Nome do ícone Lucide exibido na biblioteca ao lado do nome do preset.
     * Ex: `"User"`, `"MapPin"`, `"Heart"`.
     */
    icon: string;

    /** Categoria temática do preset. Ver tipo `PresetBlockCategory`. */
    category: PresetBlockCategory;

    /**
     * Template do container que será inserido ao usar o preset.
     * Omite o `id` (gerado na inserção) mas inclui todos os outros campos.
     * Os campos em `campos` já possuem `id` fixo para facilitar referências
     * no `cepFillMap` e condicionais de outros presets.
     */
    containerTemplate: Omit<FormContainer, 'id'> & {
        campos: (Omit<FormField, 'id'> & { id: string })[];
    };
}

/**
 * Template de container pré-configurado reutilizável (sem `id`).
 * Usado internamente em `PresetBlock.containerTemplate` e `PresetStepTemplate.containers`.
 */
export type PresetContainerTemplate = Omit<FormContainer, 'id'> & {
    campos: (Omit<FormField, 'id'> & { id: string })[];
};

/**
 * Template de um step completo dentro de um `PresetStepBlock`.
 * Descreve o step sem `id` (gerado na inserção) e seus containers pré-configurados.
 */
export interface PresetStepTemplate {
    /** Título do step exibido no indicador de progresso e no cabeçalho. */
    titulo: string;

    /** Descrição opcional do step. */
    descricao?: string;

    /**
     * Nome do ícone Lucide exibido no indicador de step.
     * Ex: `"User"`, `"MapPin"`.
     */
    icone?: string;

    /**
     * Containers pré-configurados que compõem este step.
     * Cada container segue o formato `PresetContainerTemplate`.
     */
    containers: PresetContainerTemplate[];
}

/**
 * Um bloco de múltiplos steps pré-configurados disponível na biblioteca do builder.
 *
 * Enquanto `PresetBlock` insere um único container, `PresetStepBlock` insere
 * um fluxo completo de steps — ideal para jornadas padronizadas como
 * "Inscrição em evento" ou "Cadastro completo com endereço e pagamento".
 *
 * @example
 * ```ts
 * const inscricaoEvento: PresetStepBlock = {
 *   id: 'event-registration',
 *   name: 'Inscrição em Evento',
 *   description: 'Fluxo de 3 steps: dados pessoais, endereço e pagamento',
 *   icon: 'ClipboardList',
 *   steps: [dadosPessoaisStep, enderecoStep, pagamentoStep],
 * };
 * ```
 */
export interface PresetStepBlock {
    /**
     * Identificador único do preset de steps.
     * Ex: `"event-registration"`, `"full-onboarding"`.
     */
    id: string;

    /** Nome exibido na biblioteca de presets do builder. */
    name: string;

    /** Descrição do fluxo coberto por este preset. */
    description: string;

    /**
     * Nome do ícone Lucide exibido na biblioteca ao lado do nome do preset.
     * Ex: `"ClipboardList"`, `"UserCheck"`.
     */
    icon: string;

    /**
     * Lista de steps pré-configurados que serão inseridos em sequência.
     * Os `id`s são gerados automaticamente na inserção para garantir unicidade.
     */
    steps: PresetStepTemplate[];
}