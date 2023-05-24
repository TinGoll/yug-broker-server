export const FIREBIRD_OPTIONS = 'FIREBIRD_OPTIONS';

export interface FirebirdOptions {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  lowercase_keys?: boolean;
  role?: string;
  pageSize?: number;
  retryConnectionInterval?: number;
}
