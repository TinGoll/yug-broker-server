import { Controller, Get } from '@nestjs/common';
import { PersonService } from '../services/person.service';

@Controller('api/person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get('clients')
  async getClientsAll() {
    return await this.personService.findAll('client');
  }
  @Get('users')
  async getUsersAll() {
    return await this.personService.findAll('user');
  }
}
