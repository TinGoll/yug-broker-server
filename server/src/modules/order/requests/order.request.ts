import { ItmOrderDb } from '../interfaces/itm-order.types';
import { IRequest } from '../interfaces/request.interface';

/**
 * *****************************
 * Ордер дата план
 *    select P.ID, P.ORDER_ID, P.DATE_SECTOR, P.DATE_DESCRIPTION, GET_SECTOR_NAME_TO_OLD_SECTOR(P.DATE_DESCRIPTION) as SECTOR,
       P.comment, P.DATE3, P.DATE2
from ORDERS_DATE_PLAN P
where P.ORDER_ID = 17000  
 * *****************************
 * 
 */

export class OrderRequest implements IRequest<ItmOrderDb> {

  private _one: boolean = true;
  private _limit: number = 1;
  private _orderBy = null;
  private _skip: number = 0;
  private _where: { options: Partial<ItmOrderDb>; like: boolean } = {
    options: {},
    like: false,
  };

  private baseRequest = `
  select $FIRST$ $SKIP$
       O.*, C.ID as CLIENT_ID, C.CLIENTNAME, C.CITY as CLIENT_SITY, C.PHONE as CLIENT_PHONE1, C.PHONE2 as CLIENT_PHONE2,
       C.SHORTNAME as CLIENT_SHORTNAME, C.EMAIL as CLIENT_EMAIL1, C.EMAIL2 as CLIENT_EMAIL2,
       C.comment as CLIENT_COMMENT, L.ID_SECTOR, GET_SECTOR_NAME(L.ID_SECTOR) as SECTOR,
       S.STATUS_DESCRIPTION as STATUS, JS.NAME as JSTATUS
  from ORDERS O
  left join LOCATION_ORDER L on (L.ID_ORDER = O.ID)
  left join LIST_STATUSES S on (S.STATUS_NUM = O.ORDER_STATUS)
  left join CLIENTS C on (C.CLIENTNAME = O.CLIENT)
  left join JOURNAL_STATUSES JS on (JS.ID = GET_JSTATUS_ID(O.ID)) 
  $WHERE$ $ORDER_BY$`;

  private planRequest = ``



  skip(value: number): this {
    if (!isNaN(value)) {
      this._skip = Number(value);
    }
    return this;
  }
  one(): this {
    this._one = true;
    return this;
  }
  many(): this {
    this._one = false;
    return this;
  }
  where(options: Partial<ItmOrderDb>, like: boolean = true): this {
    if (typeof options === 'object') {
      this._where = {
        options: { ...options },
        like,
      };
    }
    return this;
  }
  limit(value: number): this {
    if (!isNaN(value)) {
      this._limit = Number(value);
    }
    return this;
  }
  orderBy(options: Partial<ItmOrderDb>, collate: 'ASC' | 'DESC' = 'ASC'): this {
    if (typeof options === 'object') {
      this._orderBy = {
        options: { ...options },
        collate,
      };
    }
    return this;
  }
  build(): string {
    let firstParam = this._limit > 0 ? `first ${this._limit}` : '';
    let skipParam = this._skip > 0 ? `skip ${this._skip}` : '';
    if (this._one) {
      firstParam = 'first 1';
      skipParam = '';
    }
    const where = this._where || { options: {}, like: false };
    const options = where.options || {};
    const whereTerms: string[] = [];
    let isString = false;

    for (const key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        const value = options[key];
        isString = this.isString(value);

        whereTerms.push(`o.${key} = ${isString ? "'" + value + "'" : value}`);
      }
    }

    return this.baseRequest
      .replace('$FIRST$', firstParam)
      .replace('$SKIP$', skipParam)
      .replace(
        '$WHERE$',
        `${whereTerms.length ? `where ${whereTerms.join(' and ')}` : ''}`,
      )
      .replace('$ORDER_BY$', '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private isString(val: any): boolean {
    return typeof val === 'string' || val instanceof String;
  }
}

export default new OrderRequest();
