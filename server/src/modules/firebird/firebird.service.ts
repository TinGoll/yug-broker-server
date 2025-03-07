import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { Firebird } from './Firebird';
import { FIREBIRD_OPTIONS, FirebirdOptions } from './firebird-constants';
import { Transaction } from 'node-firebird';

@Injectable()
export class FirebirdService implements OnModuleDestroy {
  private db: Firebird | null = null;
  constructor(
    @Inject(FIREBIRD_OPTIONS)
    private readonly firebirdOptions: FirebirdOptions,
  ) {}
  async onModuleDestroy() {
    await this.detach();
  }

  async attach(): Promise<Firebird> {
    if (!this.db) {
      this.db = await new Firebird(this.firebirdOptions).create();
    }
    return this.db;
  }

  async startTransaction(transactionCallback: (db: Transaction) => Promise<void>): Promise<void> {
    const db = await this.attach();

    return new Promise((resolve, reject) => {
      db.startTransaction((err: Error, transactionDb: Transaction) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          // Выполняем колбэк с транзакцией
          transactionCallback(transactionDb)
            .then(() => {
              transactionDb.commit((commitErr: Error) => {
                if (commitErr) {
                  reject(commitErr);
                } else {
                  resolve();
                }
              });
            })
            .catch((err: Error) => {
              transactionDb.rollback((rollbackErr: Error) => {
                if (rollbackErr) {
                  reject(rollbackErr);
                } else {
                  reject(err);
                }
              });
            });
        } catch (e) {
          transactionDb.rollback((rollbackErr: Error) => {
            if (rollbackErr) {
              reject(rollbackErr);
            } else {
              reject(e);
            }
          });
        }
      });
    });
  }

  /** Откатить транзакцию */
  async rollbackTransaction(transactionDb: Transaction): Promise<void> {
    return new Promise((resolve, reject) => {
      transactionDb.rollback((err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async detach(): Promise<void> {
    if (this.db) {
      try {
        await this.db.detach();
        this.db = null;
      } catch (e) {
        console.error('Ошибка при закрытии соединения Firebird:', e);
        throw e;
      }
    }
  }
}
