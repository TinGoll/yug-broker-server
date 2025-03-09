import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebirdModule } from './modules/firebird/firebird.module';
import { OrderModule } from './modules/order/order.module';
import { PersonModule } from './modules/person/person.module';
import { ItmManagerModule } from './modules/itm-manager/itm-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
