// Local copy of the template-variable contract used by the editor.
export const TEMPLATE_VARIABLE_CATEGORY = {
  PROSPECT: 'prospect',
  ORGANIZATION_CUSTOM_FIELD: 'organizationCustomField',
  CAMPAIGN_CUSTOM_FIELD: 'campaignCustomField',
  GLOBAL: 'global',
} as const;

export type TemplateVariableCategory =
  (typeof TEMPLATE_VARIABLE_CATEGORY)[keyof typeof TEMPLATE_VARIABLE_CATEGORY];

export type TemplateVariable = {
  key: string;
  label: string;
  /** A built-in category, or the id of a caller-supplied `variableCategories` entry. */
  category: TemplateVariableCategory | (string & {});
  /** Inserts a link with this text pointing at the variable instead of the bare tag. */
  linkText?: string;
};

/** A heading in the variable menu; categories are listed in array order. */
export type TemplateVariableCategoryOption = { id: string; label: string };
