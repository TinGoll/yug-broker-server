import { Module, DynamicModule, Provider } from '@nestjs/common';
import { FirebirdService } from './firebird.service';
import { FIREBIRD_OPTIONS, FirebirdOptions } from './firebird-constants';

@Module({})
export class FirebirdModule {
  static forRoot(options: FirebirdOptions): DynamicModule {
    const firebirdOptionsProvider: Provider = {
      provide: FIREBIRD_OPTIONS,
      useValue: options,
    };

    return {
      module: FirebirdModule,
      providers: [firebirdOptionsProvider, FirebirdService],
      exports: [FirebirdService],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: FirebirdModule,
      providers: [FirebirdService],
      exports: [FirebirdService],
    };
  }
}
