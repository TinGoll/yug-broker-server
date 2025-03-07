import { Module, DynamicModule, Provider } from '@nestjs/common';
import { FirebirdService } from './firebird.service';
import { FIREBIRD_OPTIONS, FirebirdOptions } from './firebird-constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
})
export class FirebirdModule {
  static forRoot(options?: Partial<FirebirdOptions>): DynamicModule {
    const firebirdOptionsProvider: Provider = {
      provide: FIREBIRD_OPTIONS,
      useFactory: (configService: ConfigService) => ({
        ...options,
        host: configService.get<string>('FIREBIRD_HOST', 'localhost'),
        port: configService.get<number>('FIREBIRD_PORT', 3050),
        database: configService.get<string>(
          'FIREBIRD_DATABASE',
          'F:/javascript/massiv-yug/db/ITM_DB.FDB',
        ),
        user: configService.get<string>('FIREBIRD_USER', 'SYSDBA'),
        password: configService.get<string>('FIREBIRD_PASSWORD', 'masterkey'),
      }),
      inject: [ConfigService],
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
