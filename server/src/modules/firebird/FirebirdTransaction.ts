import { Transaction } from 'node-firebird';

export class FirebirdTransaction {
  private db: Transaction;

  constructor(db: Transaction) {
    this.db = db;
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

  rollback(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.rollback((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  rollbackRetaining(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.rollbackRetaining((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  commit(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.commit((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  commitRetaining(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.commitRetaining((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}
