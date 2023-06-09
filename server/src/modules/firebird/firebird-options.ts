import { FirebirdOptions } from './firebird-constants';

export const firebirdOptions: FirebirdOptions = {
  host: '192.168.2.101',
  port: 3050,
  database: '/mnt/2T/Archive/Work/FireBird DB/itm/data base/ITM_DB.FDB',
  user: 'ITM',
  password: 'AdmUser',
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
  retryConnectionInterval: 1000,
};
