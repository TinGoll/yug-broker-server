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
  ) {
    console.log('\x1b[33m%s\x1b[0m', 'firebirdOptions', firebirdOptions);
  }
  async onModuleDestroy() {
    await this.detach();
  }

  async attach(): Promise<Firebird> {
    if (!this.db) {
      this.db = await new Firebird().create(this.firebirdOptions);
    }
    return this.db;
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
