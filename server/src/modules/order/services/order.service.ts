import { HttpException, Injectable } from '@nestjs/common';
import { FirebirdService } from 'src/modules/firebird/firebird.service';
import {
  ItmOrder,
  ItmOrderDataPlanDb,
  ItmOrderDb,
  ItmOrderElementDb,
} from '../interfaces/itm-order.types';
import orderRequest from '../requests/order.request';
import { Converter } from './converter';

interface Where extends Partial<ItmOrderDb> {
  elements?: Partial<ItmOrderElementDb>;
}
interface FindOne {
  where: Where;
}

interface FindMany {
  where: Where;
  limit?: number;
  skip?: number;
}


function debounce<F extends (...args: any[]) => void>(f: F, ms: number) {
  let isCooldown = false;

  return function (...args: Parameters<F>) {
    if (isCooldown) return;
    f.apply(this, args);
    isCooldown = true;
    setTimeout(() => (isCooldown = false), ms);
  };
}

function fun(name: string) {
  console.log('Привет ' + name);
}
const f = debounce(fun, 1000);




@Injectable()
export class OrderService {
  constructor(
    private readonly firebirdService: FirebirdService,
    private readonly converter: Converter,
  ) {
    // this.findOne({ where: { ID: 17000 } }).then((order) => console.log(order.elements));
  }

  async findOne({ where }: FindOne = { where: {} }): Promise<ItmOrder> {
    try {
      const db = await this.firebirdService.attach();
      const request = orderRequest.one().where(where, true).build();
      const [dbOrder] = await db.executeAndReturning<ItmOrderDb[]>(request);
      if (!dbOrder)
        throw new HttpException('Заказ не найден в базе данных.', 404);

      const elements = await db.executeAndReturning<ItmOrderElementDb[]>(
        `SELECT * FROM ORDERS_ELEMENTS L WHERE L.ORDER_ID = ?`,
        [dbOrder.ID],
      );

      const plans = await db.executeAndReturning<ItmOrderDataPlanDb[]>(
        `select P.ID, P.ORDER_ID, P.DATE_SECTOR, P.DATE_DESCRIPTION, GET_SECTOR_NAME_TO_OLD_SECTOR(P.DATE_DESCRIPTION) as SECTOR,
            P.comment, P.DATE3, P.DATE2
          from ORDERS_DATE_PLAN P
          where P.ORDER_ID = ?`,
        [dbOrder.ID],
      );

      db.detach();

      return this.converter.dbDataToOrder(dbOrder, plans, elements);
    } catch (e) {
      throw e;
    }
  }

  async find(
    { where, limit = 0, skip = 0 }: FindMany = { where: {} },
  ): Promise<ItmOrder[]> {
    const request = orderRequest
      .many()
      .limit(limit)
      .skip(skip)
      .where(where, true)
      .build();
    console.log(request);
    const db = await this.firebirdService.attach();
    const dbData = await db.executeAndReturning<ItmOrderDb[]>(request);
    db.detach();
    console.log(JSON.stringify(dbData, null, 2));
    return;

    return [];
  }

  async create(params: ItmOrder) {}

  async update(params: Partial<ItmOrder>) {}

  async delete(id: number) {}
}
