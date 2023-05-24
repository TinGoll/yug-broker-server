import { Module } from '@nestjs/common';
import { ItmController } from './itm.controller';

@Module({
  controllers: [ItmController],
})
export class ItmManagerModule {}
