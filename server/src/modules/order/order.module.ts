import { Module } from '@nestjs/common';
import { FirebirdModule } from '../firebird/firebird.module';
import { Converter } from './services/converter';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';

@Module({
  imports: [FirebirdModule.forRoot()],
  providers: [OrderService, Converter],
  controllers: [OrderController],
})
export class OrderModule {}
