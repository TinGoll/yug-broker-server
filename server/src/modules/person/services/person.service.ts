import { Injectable } from '@nestjs/common';
import { FirebirdService } from 'src/modules/firebird/firebird.service';
import Person from '../types/person.module.type';
import { PersonRole } from '../enums/person-role';
import { UserRole } from '../enums/user-role';

@Injectable()
export class PersonService {
  constructor(private readonly firebirdService: FirebirdService) {
    // console.log(this.formatPhoneNumber(`89884770946`));   //+79884770946
    // console.log(this.formatPhoneNumber(`79884770946`));   //+79884770946
    // console.log(this.formatPhoneNumber(`9884770946`));    //+79884770946
    // console.log(this.formatPhoneNumber(`+79884770946`));  //+79884770946
    // console.log(this.formatPhoneNumber(`4770946`));       //4770946
  }

  /** Получить все */
  async findAll<T extends Person.PersonType = Person.PersonType>(
    type: 'client' | 'user',
  ): Promise<T[] | any[]> {
    const result: any[] = [];

    const db = await this.firebirdService.attach();

    if (type === 'client') {
      const clientsDb = await db.executeAndReturning<Person.ItmClientDb[]>(
        `select C.*, U.USERNAME as LOGIN, U.PASSWD as USER_PASSWORD, U.USERROLE
          from CLIENTS C
          left join USERS U on (U.CLIENTID = C.ID)`,
        [],
      );

      result.push(...clientsDb);
    }
    if (type === 'user') {
      const usersDb = await db.executeAndReturning<Person.ItmUserDb[]>(
        `select e.*, s.name as sector from employers e
          left join sectors s on (s.id = e.id_sector)`,
        [],
      );
      result.push(...usersDb);
    }

    return result.map((res) => this.converter(res, type));
  }

  async findOne<T extends Person.PersonType = Person.PersonType>(
    id: number,
    type: 'client' | 'user',
  ): Promise<T> {
    const db = await this.firebirdService.attach();
    let result: any;
    if (type === 'client') {
      const [clientDb] = await db.executeAndReturning<Person.ItmClientDb[]>(
        `select * from clients c
          left join USERS U on (U.CLIENTID = C.ID)
         where c.id = ?`,
        [id],
      );
      if (!clientDb) {
        return null;
      }
      result = clientDb;
    }

    if (type === 'user') {
      const [userDb] = await db.executeAndReturning<Person.ItmUserDb[]>(
        `select e.*, s.name as sector from employers e
          left join sectors s on (s.id = e.id_sector) where e.id = ?`,
        [id],
      );
      if (!userDb) {
        return null;
      }
      result = userDb;
    }

    return <T>this.converter(result, type);
  }

  private converter<T extends Person.PersonType = Person.PersonType>(
    object: Person.ItmUserDb | Person.ItmClientDb,
    type: 'client' | 'user',
  ): T {
    let result: T;
    if (type === 'client') {
      const clientDb = object as Person.ItmClientDb;

      const phones: string[] = [];
      const emails: string[] = [];

      if (clientDb.PHONE) {
        const num = this.formatPhoneNumber(clientDb.PHONE);
        phones.push(num ? num : clientDb.PHONE);
      }
      if (clientDb.PHONE2) {
        const num = this.formatPhoneNumber(clientDb.PHONE2);
        phones.push(num ? num : clientDb.PHONE2);
      }

      if (clientDb.EMAIL) {
        emails.push(clientDb.EMAIL);
      }
      if (clientDb.EMAIL2) {
        emails.push(clientDb.EMAIL2);
      }

      const client: Person.Client = {
        id: clientDb.ID,
        extraData: {
          profiler: Boolean(clientDb.PROFILER),
          prepaid: clientDb.IS_PREPAID === 0 ? false : true,
        },
        firstName: clientDb.CLIENTNAME ? clientDb.CLIENTNAME.trim() : '',
        lastName: null,
        middleName: null,
        personRoles: [PersonRole.CLIENT],
        userRoles: [],
        login: clientDb.LOGIN,
        password: clientDb.USER_PASSWORD,
        gender: 'Male',
        phones,
        emails,
        city: clientDb.CITY ? clientDb.CITY.trim() : '',
        card: {
          number: '',
          cardHolder: '',
        },
        bank: clientDb.JUR_BANK,
        bik: clientDb.JUR_BIK,
        companyName: clientDb.JUR_CUSTOMER ? clientDb.JUR_CUSTOMER.trim() : '',
        inn: clientDb.JUR_INN,
      };
      if (clientDb.LOGIN) {
        client.personRoles.push(PersonRole.USER);
      }
      result = client as any;
    }

    if (type === 'user') {
      const userDb = object as Person.ItmUserDb;

      const phones: string[] = [];
      const emails: string[] = [];

      if (userDb.PHONE) {
        const num = this.formatPhoneNumber(userDb.PHONE);
        phones.push(num ? num : userDb.PHONE);
      }

      const user: Person.User = {
        id: userDb.ID,
        sector: userDb.SECTOR,
        status: userDb.STATUS === 1 ? 'active' : 'fired',
        lastName: userDb.FIRSTNAME ? userDb.FIRSTNAME.trim() : userDb.NAME,
        firstName: userDb.LASTNAME ? userDb.LASTNAME.trim() : '',
        middleName: userDb.MIDDLENAME ? userDb.MIDDLENAME.trim() : '',
        personRoles: [
          PersonRole.WORKER,
          userDb.MGMT_PASS ? PersonRole.USER : undefined,
        ],
        userRoles: [],
        login: userDb.NAME,
        gender: 'Male',
        phones,
        emails,
        city: '',
        card: {
          number: userDb.BANK_CARD,
          cardHolder: userDb.CARD_HOLDER,
        },
        password: userDb.MGMT_PASS,
      };
      result = user as any;
    }

    return <T>result;
  }

  formatPhoneNumber(phone: string) {
    let phoneNumber = phone;
    // Удаление всех символов, кроме цифр
    phoneNumber = phoneNumber.replace(/\D/g, '');

    // Добавление +7, если номер содержит 10 цифр или первой цифрой является 8
    if (phoneNumber.length === 10 || phoneNumber[0] === '8') {
      phoneNumber = '+7' + phoneNumber.slice(-10);
    }

    // Добавление +, если номер содержит 11 цифр и первой цифрой является 7
    if (phoneNumber.length === 11 && phoneNumber[0] === '7') {
      phoneNumber = '+' + phoneNumber;
    }

    return phoneNumber;
  }

  // formatPhoneNumber = (phoneNumber: string) =>
  //   phoneNumber.replace(/^8/, '+7').replace(/^7(?=\d{10}$)/, '+7');
}
