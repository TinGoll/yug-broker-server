import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebirdModule } from './modules/firebird/firebird.module';
import { OrderModule } from './modules/order/order.module';
import { PersonModule } from './modules/person/person.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ItmManagerModule } from './modules/itm-manager/itm-manager.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', "..", 'client', 'build'),
      exclude: ['/api/(.*)'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: config.get<'postgres'>('TYPEORM_CONNECTION'),
        // host: config.get<string>('TYPEORM_HOST'),
        // port: config.get<number>('TYPEORM_PORT'),
        // username: config.get<string>('TYPEORM_USERNAME'),
        // password: config.get<string>('TYPEORM_PASSWORD'),
        database: config.get<string>('TYPEORM_DATABASE'),
        entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
        migrations: [__dirname + 'src/migrations/*{.js,.ts}'],
        migrationsTableName: 'migrations',
        synchronize: true,
        autoLoadEntities: true,
        logging: ['error', 'warn'], //'query',
      }),
    }),
    FirebirdModule,
    OrderModule,
    PersonModule,
    ItmManagerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
