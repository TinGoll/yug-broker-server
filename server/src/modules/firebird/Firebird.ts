// import NodeFirebird from 'node-firebird';
import * as NodeFirebird from 'node-firebird';
import { Database, ISOLATION_READ_COMMITTED, Options, TransactionCallback} from 'node-firebird';

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
  private db!: Database;
  private options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  create(): Promise<Firebird> {
    try {
      return new Promise((resolve, reject) => {
        NodeFirebird.attachOrCreate(
          this.options,
          (err: Error, db: Database) => {
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
        this.db.query(query, params, (err: Error, res: any) => {
          if (err) reject(err);
          resolve();
        });
      });
    } catch (e) {
      throw e;
    }
  }

  startTransaction(transactionCallback: TransactionCallback) {
    this.db.transaction(
      ISOLATION_READ_COMMITTED,
      transactionCallback,
    );
  }

  detach() {
    this.db.detach();
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve();
      this.db.detach((err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  getDb(): Database {
    return this.db;
  }
}
