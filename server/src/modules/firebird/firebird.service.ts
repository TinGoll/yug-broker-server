import { Injectable, Inject } from '@nestjs/common';
import { Firebird } from './Firebird';
import { FIREBIRD_OPTIONS, FirebirdOptions } from './firebird-constants';

@Injectable()
export class FirebirdService {
  constructor(
    @Inject(FIREBIRD_OPTIONS)
    private readonly firebirdOptions: FirebirdOptions,
  ) {}

  async attach(): Promise<Firebird> {
    const db = new Firebird(this.firebirdOptions);
    return await db.create();
  }
  async detach(db: Firebird): Promise<void> {
    try {
      db.detach();
    } catch (e) {
      throw e;
    }
  }

  getOptions(): FirebirdOptions {
    return { ...this.firebirdOptions };
  }
}
