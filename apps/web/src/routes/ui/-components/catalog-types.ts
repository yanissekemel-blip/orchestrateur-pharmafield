import type { ReactNode } from 'react';

export type CatalogItem = {
  id: string;
  name: string;
  description: string;
  preview: ReactNode;
  wide?: boolean;
};

export type CatalogGroup = {
  id: string;
  title: string;
  description: string;
  items: CatalogItem[];
};
