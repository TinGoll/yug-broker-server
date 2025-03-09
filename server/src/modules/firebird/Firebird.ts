// import NodeFirebird from 'node-firebird';
import * as NodeFirebird from 'node-firebird';
import {
  Database,
  ISOLATION_READ_COMMITTED,
  Options,
  TransactionCallback,
} from 'node-firebird';
import { FirebirdTransaction } from './FirebirdTransaction';

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

  constructor(db: Database = null) {
    this.db = db;
  }

  create(options: Options): Promise<Firebird> {
    return new Promise((resolve, reject) => {
      NodeFirebird.attachOrCreate(options, (err: Error, db: Database) => {
        if (err) reject(err);
        this.db = db;
        resolve(this);
      });
    });
  }

  executeRequest<T>(query: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.query(query, params, (err: Error, results: T[]) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  executeAndReturning<T>(query: string, params: any[] = []): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db.query(query, params, (err: Error, row: any) => {
        if (err) reject(err);
        const res: T = row;
        resolve(res);
      });
    });
  }
  execute(query: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.query(query, params, (err: Error, res: any) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  startTransaction(
    transactionCallback: (err: any, transaction: FirebirdTransaction) => void,
  ) {
    this.db.transaction(ISOLATION_READ_COMMITTED, async (err, transaction) => {
      transactionCallback(err, new FirebirdTransaction(transaction));
    });
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
