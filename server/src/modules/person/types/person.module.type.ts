import { PersonRole } from '../enums/person-role';
import { UserRole } from '../enums/user-role';

declare module Person {
  interface PersonType {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    personRoles: PersonRole[];
    userRoles: UserRole[];
    login: string;
    password?: string;
    gender: 'Male' | 'Female';
    phones: string[];
    emails: string[];
    city: string;
    card: {
      number: string;
      cardHolder: string;
    };
  }

  interface User extends PersonType {
    sector: string;
    status: 'fired' | 'active' | 'banned';
  }

  interface Client extends PersonType {
    companyName?: string;
    inn?: string;
    legalAddress?: string;
    correspondentAccount?: string;
    checkingAccount?: string;
    bank?: string;
    bik?: string;
    payType?: 'Карта' | 'Счет' | 'Наличные';
    extraData: {
      profiler?: boolean;
      prepaid?: boolean;
    };
  }

  interface ItmUserDb {
    ID: number;
    MGMT_PASS: string | null;
    NAME: string | null;
    ID_SECTOR: number | null;
    SECTOR: string | null;
    DEPARTMENT: string | null;
    STATUS: number | null;
    LOCATION: string | null;
    FIRSTNAME: string | null;
    LASTNAME: string | null;
    MIDDLENAME: string | null;
    BANK_CARD: string | null;
    CARD_HOLDER: string | null;
    PHONE: string | null;
    PERMISSION_GROUP_ID: number | null;
  }

  interface ItmClientDb {
    ID: number;
    CLIENTNAME: string | null;
    CITY: string | null;
    PHONE: string | null;
    PHONE2: string | null;
    SHORTNAME: string | null;
    EMAIL: string | null;
    EMAIL2: string | null;
    PRICE_COLUMN: number | null;
    COMMENT: string | null;
    JUR_CUSTOMER: string | null;
    JUR_INN: string | null;
    JUR_ADDRESS: string | null;
    JUR_RASSSHET: string | null;
    SERV_MANAGER: string | null;
    JUR_KORRSHET: string | null;
    JUR_BANK: string | null;
    JUR_BIK: string | null;
    PAYTYPES: string | null;
    CLIENT_WEBSITE: string | null;
    IS_PREPAID: number | null;
    PROFILER: number | null;
    LOGIN: string | null;
    USER_PASSWORD: string | null;
    USERROLE: string | null;
  }
}

export default Person;
