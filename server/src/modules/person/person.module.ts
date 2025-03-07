import { Module } from '@nestjs/common';
import { PersonService } from './services/person.service';
import { FirebirdModule } from '../firebird/firebird.module';
import { PersonController } from './controllers/person.controller';

@Module({
  imports: [FirebirdModule.forRoot()],
  providers: [PersonService],
  exports: [PersonService],
  controllers: [PersonController],
})
export class PersonModule {}
