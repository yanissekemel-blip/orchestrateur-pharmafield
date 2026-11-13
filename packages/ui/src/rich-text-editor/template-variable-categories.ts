import {
  TEMPLATE_VARIABLE_CATEGORY,
  type TemplateVariable,
  type TemplateVariableCategory,
  type TemplateVariableCategoryOption,
} from './template-variables';

export const templateVariableCategoryOrder: readonly TemplateVariableCategory[] =
  [
    TEMPLATE_VARIABLE_CATEGORY.GLOBAL,
    TEMPLATE_VARIABLE_CATEGORY.PROSPECT,
    TEMPLATE_VARIABLE_CATEGORY.ORGANIZATION_CUSTOM_FIELD,
    TEMPLATE_VARIABLE_CATEGORY.CAMPAIGN_CUSTOM_FIELD,
  ];

export const templateVariableCategoryLabels: Record<
  TemplateVariableCategory,
  string
> = {
  [TEMPLATE_VARIABLE_CATEGORY.GLOBAL]: 'Global',
  [TEMPLATE_VARIABLE_CATEGORY.PROSPECT]: 'Prospect',
  [TEMPLATE_VARIABLE_CATEGORY.ORGANIZATION_CUSTOM_FIELD]:
    'Champs personnalisés de l’organisation',
  [TEMPLATE_VARIABLE_CATEGORY.CAMPAIGN_CUSTOM_FIELD]:
    'Champs personnalisés de la campagne',
};

const defaultCategories: TemplateVariableCategoryOption[] =
  templateVariableCategoryOrder.map((id) => ({
    id,
    label: templateVariableCategoryLabels[id],
  }));

export function groupTemplateVariables(
  variables: TemplateVariable[],
  query = '',
  categories: readonly TemplateVariableCategoryOption[] = defaultCategories,
) {
  const normalizedQuery = query.toLowerCase();
  const variablesByCategory = new Map<string, TemplateVariable[]>();

  for (const variable of variables) {
    if (
      !variable.key.toLowerCase().includes(normalizedQuery) &&
      !variable.label.toLowerCase().includes(normalizedQuery)
    ) {
      continue;
    }

    const categoryVariables = variablesByCategory.get(variable.category);
    if (categoryVariables) categoryVariables.push(variable);
    else variablesByCategory.set(variable.category, [variable]);
  }

  const orderedVariables: TemplateVariable[] = [];
  const groups: Array<{
    category: string;
    label: string;
    variables: Array<{ index: number; variable: TemplateVariable }>;
  }> = [];

  for (const { id: category, label } of categories) {
    const categoryVariables = variablesByCategory.get(category);
    if (!categoryVariables?.length) continue;

    const indexedVariables: Array<{
      index: number;
      variable: TemplateVariable;
    }> = [];
    for (const variable of categoryVariables) {
      indexedVariables.push({ index: orderedVariables.length, variable });
      orderedVariables.push(variable);
    }
    groups.push({
      category,
      label,
      variables: indexedVariables,
    });
  }

  return { orderedVariables, groups };
}
