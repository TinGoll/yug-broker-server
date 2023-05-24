import {
  FirebirdDatabaseOperation,
  FirebirdConnectionOptions,
  FirebirdResult,
  TransCallback,
  EventCallback,
} from './firebird-types';
// import NodeFirebird from 'node-firebird';
import * as NodeFirebird from 'node-firebird';

export enum FirebirdEvents {
  row = 'row',
  result = 'result',
  attach = 'attach',
  detach = 'detach',
  reconnect = 'reconnect',
  error = 'error',
  transaction = 'transaction',
  commit = 'commit',
  rollback = 'rollback',
}

export class Firebird {
  private db!: FirebirdDatabaseOperation;
  private options: FirebirdConnectionOptions;

  constructor(options: FirebirdConnectionOptions) {
    this.options = options;
  }

  create(): Promise<Firebird> {
    try {
      return new Promise((resolve, reject) => {
        NodeFirebird.attachOrCreate(
          this.options,
          (err: Error, db: FirebirdDatabaseOperation) => {
            if (err) reject(err);
            this.db = db;
            resolve(this);
          },
        );
      });
    } catch (e) {
      throw e;
    }
  }

  executeRequest<T>(query: string, params: any[] = []): Promise<T[]> {
    try {
      return new Promise((resolve, reject) => {
        this.db.query(query, params, (err: Error, results: T[]) => {
          if (err) reject(err);
          resolve(results);
        });
      });
    } catch (e) {
      throw e;
    }
  }
  executeAndReturning<T>(query: string, params: any[] = []): Promise<T> {
    try {
      return new Promise((resolve, reject) => {
        this.db.query(query, params, (err: Error, row: any) => {
          if (err) reject(err);
          const res: T = row;
          resolve(res);
        });
      });
    } catch (e) {
      throw e;
    }
  }
  execute(query: string, params: any[] = []): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        this.db.query(query, params, (err: Error, res: FirebirdResult[]) => {
          if (err) reject(err);
          resolve();
        });
      });
    } catch (e) {
      throw e;
    }
  }

  startTransaction(transactionCallback: TransCallback) {
    this.db.transaction(
      NodeFirebird.ISOLATION_READ_COMMITED,
      transactionCallback,
    );
  }

  on(event: FirebirdEvents, eventCallback: EventCallback) {
    this.db.on(event, eventCallback);
  }

  detach() {
    this.db.detach();
  }
}
