import { HttpException, Injectable } from '@nestjs/common';
import { FirebirdService } from 'src/modules/firebird/firebird.service';
import {
  CreateItmOrderIn,
  ItmOrder,
  ItmOrderDataPlanDb,
  ItmOrderDb,
  ItmOrderElementDb,
  SaveItmOrderIn,
  UpdateItmOrderIn,
} from '../interfaces/itm-order.types';
import orderRequest from '../requests/order.request';
import { Converter } from './converter';
import {
  getCreateOrderElementRequestParams,
  getCreateOrderRequestParams,
} from '../requests/order-create.request';
import { getUpdateOrderRequestParams } from '../requests/order-update.request';

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

// function debounce<F extends (...args: any[]) => void>(f: F, ms: number) {
//   let isCooldown = false;

//   return function (...args: Parameters<F>) {
//     if (isCooldown) return;
//     f.apply(this, args);
//     isCooldown = true;
//     setTimeout(() => (isCooldown = false), ms);
//   };
// }

// function fun(name: string) {
//   console.log('Привет ' + name);
// }
// const f = debounce(fun, 1000);

@Injectable()
export class OrderService {
  constructor(
    private readonly firebirdService: FirebirdService,
    private readonly converter: Converter,
  ) {
    // this.delete(36223);
    // this.update({
    //   id: 36223,
    //   client: {
    //     name: 'Вася',
    //   },
    //   clientNumber: 'Testing',
    //   material: {
    //     name: 'Дуб',
    //   },
    //   orderType: 'Фасады',
    //   author: {
    //     userName: 'server',
    //   },
    //   color: {
    //     name: 'Зеленый',
    //     note: 'Очень зеленый',
    //   },
    //   statuses: {
    //     oldStatus: {
    //       num: 2,
    //     },
    //   },
    //   elements: [
    //     {
    //       name: 'Фасад глухой',
    //       note: 'Примечание',
    //       geometry: {
    //         amount: 1,
    //         height: 916,
    //         width: 396,
    //       }
    //     },
    //     {
    //       name: 'Фасад глухой',
    //       note: 'Примечание',
    //       geometry: {
    //         amount: 5,
    //         height: 716,
    //         width: 396,
    //       }
    //     },
    //     {
    //       name: 'Фасад глухой',
    //       note: 'Примечание',
    //       geometry: {
    //         amount: 1,
    //         height: 596,
    //         width: 396,
    //       }
    //     },
    //     {
    //       name: 'Фасад глухой',
    //       note: 'Примечание',
    //       geometry: {
    //         amount: 1,
    //         height: 396,
    //         width: 396,
    //       }
    //     },
    //   ]
    // }).then((result) => {
    // });
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
    console.log(JSON.stringify(dbData, null, 2));
    return;
  }

  async generateOrderID(): Promise<number> {
    const db = await this.firebirdService.attach();
    const [result] = await db.executeAndReturning<[{ ORDER_ID: number }]>(
      'select gen_id (gen_orders_id,1) as ORDER_ID from rdb$database',
    );
    return result.ORDER_ID;
  }

  async isOrderExists(orderID: number | string): Promise<boolean> {
    const db = await this.firebirdService.attach();
    const [result] = await db.executeAndReturning<[{ ID: number }]>(
      'select o.id from orders o where o.id = ?',
      [orderID],
    );
    return Boolean(result?.ID);
  }

  async create(params: CreateItmOrderIn) {
    const db = await this.firebirdService.attach();
    return new Promise<number>((resolve, reject) => {
      db.startTransaction(async (err, transaction) => {
        if (err) {
          throw err;
        }
        try {
          const orderID = await this.generateOrderID();
          const paramsWithID = { ...params, id: orderID };
          const request = getCreateOrderRequestParams(paramsWithID);
          const result = await transaction.executeAndReturning<{ ID: number }>(
            ...request,
          );

          if (!result?.ID) {
            throw new HttpException('Не удалось создать новый заказ', 500);
          }
          const elements = paramsWithID.elements || [];
          for (const elemetParams of elements) {
            const elementParamsWithOrderID = {
              ...elemetParams,
              orderId: orderID,
            };
            const elementRequest = getCreateOrderElementRequestParams(
              elementParamsWithOrderID,
            );
            await transaction.executeAndReturning(...elementRequest);
          }

          await transaction.commit();
          resolve(result.ID);
        } catch (e) {
          await transaction.rollback();
          reject(e);
        }
      });
    });
  }

  async update(params: UpdateItmOrderIn) {
    const db = await this.firebirdService.attach();
    return new Promise<void>((resolve, reject) =>
      db.startTransaction(async (err, transaction) => {
        if (err) {
          throw err;
        }
        try {
          const orderID = params.id;
          if (!orderID) {
            throw new HttpException('Операция ожидает id заказа', 400);
          }
          const isExists = await this.isOrderExists(orderID);
          if (!isExists) {
            throw new HttpException(
              `Заказ ID ${orderID} не найден в базе данных`,
              404,
            );
          }

          const request = getUpdateOrderRequestParams(params);
          await transaction.executeAndReturning<{ ID: number }>(...request);
          await transaction.execute(
            'delete from orders_elements e where  e.order_id = ?',
            [orderID],
          );

          const elements = params.elements || [];
          for (const elemetParams of elements) {
            const elementParamsWithOrderID = {
              ...elemetParams,
              orderId: orderID,
            };
            const elementRequest = getCreateOrderElementRequestParams(
              elementParamsWithOrderID,
            );
            await transaction.executeAndReturning(...elementRequest);
          }

          transaction.commit();
          resolve();
        } catch (e) {
          await transaction.rollback();
          reject(e);
        }
      }),
    );
  }

  async delete(id: number) {
    const db = await this.firebirdService.attach();
    const isExists = await this.isOrderExists(id);
    if (!isExists) {
      throw new HttpException(`Заказ ID ${id} не найден в базе данных`, 404);
    }
    await db.execute('UPDATE orders o SET o.order_status = -9 WHERE o.id = ?', [
      id,
    ]);
  }
}
