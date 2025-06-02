export interface DatabaseSchema {
  health_units: HealthUnitsTable;
  audit_categories: AuditCategoriesTable;
  audit_items: AuditItemsTable;
  audits: AuditsTable;
  audit_responses: AuditResponsesTable;
}

export interface HealthUnitsTable {
  id: Generated<number>;
  name: string;
  type: string;
  address: string;
  cnes_code: string | null;
  manager_name: string | null;
  phone: string | null;
  email: string | null;
  created_at: Generated<string>;
  updated_at: Generated<string>;
}

export interface AuditCategoriesTable {
  id: Generated<number>;
  name: string;
  description: string | null;
  weight: number;
  created_at: Generated<string>;
}

export interface AuditItemsTable {
  id: Generated<number>;
  category_id: number;
  item_text: string;
  points: number;
  is_mandatory: number;
  created_at: Generated<string>;
}

export interface AuditsTable {
  id: Generated<number>;
  health_unit_id: number;
  auditor_name: string;
  audit_date: string;
  status: string;
  total_score: number | null;
  max_score: number | null;
  percentage: number | null;
  observations: string | null;
  created_at: Generated<string>;
  updated_at: Generated<string>;
}

export interface AuditResponsesTable {
  id: Generated<number>;
  audit_id: number;
  audit_item_id: number;
  status: string;
  score: number;
  observations: string | null;
  created_at: Generated<string>;
  // Note: This table has a unique constraint on (audit_id, audit_item_id)
}

type Generated<T> = T;
