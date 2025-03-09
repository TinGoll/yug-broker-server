import { CreateItmElementIn, CreateItmOrderIn, ItmOrderDb, ItmOrderElementDb, SaveItmOrderIn } from '../interfaces/itm-order.types';

type OrderDbField = keyof Omit<
  ItmOrderDb,
  | 'CLIENT_ID'
  | 'CLIENTNAME'
  | 'CLIENT_SITY'
  | 'CLIENT_PHONE1'
  | 'CLIENT_PHONE2'
  | 'CLIENT_SHORTNAME'
  | 'CLIENT_EMAIL1'
  | 'CLIENT_EMAIL2'
  | 'CLIENT_COMMENT'
  | 'ID_SECTOR'
  | 'SECTOR'
  | 'STATUS'
  | 'JSTATUS'
>;

type ElementDbField = keyof Omit<ItmOrderElementDb, 'ID'>;
type CreateElement = (params: CreateItmElementIn) => [string, any[]];
type CreateOrder = (params: CreateItmOrderIn) => [string, any[]];

export const getCreateOrderElementRequestParams: CreateElement = (params) => {
  const fieldMap: Record<ElementDbField, string | number> = {
    ORDER_ID: params.orderId,
    NAME: params.name,
    HEIGHT: params.geometry?.height,
    WIDTH: params.geometry?.width,
    EL_COUNT: params.geometry?.amount,
    SQUARE: params.geometry?.square,
    COMMENT: params.note,
    CALC_AS: params.payments?.calcAs,
    MOD_PRICE: params.payments?.priceModifer,
    PRICE_COST: params.payments?.priceCost,
    COST: params.payments?.cost,
    COST_SNG: params.payments?.costSng,
    CALC_COMMENT: params.payments?.note,
  };

  const entries = Object.entries(fieldMap);
  const request = `
            INSERT INTO orders_elements (${entries.map((entry) => `"${entry[0]}"`).join(', ')}) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

  return [request, entries.map((entry) => {
    return Boolean(entry[1]) && entry[1] !== 'undefined' ? entry[1] : null;
  }),]
}

export const getCreateOrderRequestParams: CreateOrder = (
  params,
) => {
  const fieldMap: Record<OrderDbField, string | number> = {
    ID: String(params.id),
    MANAGER: params.author?.userName,
    CLIENT: params.client?.name,
    ORDERNUM: params.clientNumber,
    ITM_ORDERNUM:
      params.id && params.client?.name && params.clientNumber
        ? `${params.id} ${params.client?.name} ${params.clientNumber}`.trim()
        : null,
    FASAD_MAT: params.material?.name,
    FASAD_MODEL: params.profile?.name,
    FASAD_PG_WIDTH: params.profile?.widths?.join('/'),
    TEXTURE: params.texture?.name,
    FIL_MAT: params.panel?.material?.name,
    FIL_MODEL: params.panel?.name,
    COLOR: params.color?.name,
    FIL_COLOR: params.panel?.color?.name,
    COLOR_TYPE: params.color?.type,
    COLOR_LAK: params.varnish?.name,
    COLOR_PATINA: params.patina?.name,
    ORDER_GENERALSQ: params.orderResult?.generalSquare,
    ORDER_FASADSQ: params.orderResult?.fasadeSquare,
    GLASS: params.glass,
    PRIMECH: params.note,
    ORDER_COST_PRICECOLUMN: null,
    ORDER_COST: params.orderPayments?.cost,
    ORDER_PAY: params.orderPayments?.payment,
    ORDER_TOTAL_COST: params.orderPayments?.totalCost,
    ORDER_DISCOUNT: params.orderPayments?.discount,
    ORDER_DISCOUNT_COMMENT: params.orderPayments?.discountComment,
    ORDER_COSTUP: params.orderPayments?.costUp,
    ORDER_COSTUP_COMMENT: params.orderPayments?.costUpComment,
    ORDER_COST_PACK: params.orderPayments?.costPack,
    ORDER_COST_GLASS: params.orderPayments?.costGlass,
    FACT_DATE_RECEIVE: params.dates?.receive,
    FACT_DATE_FIRSTSAVE: params.dates?.firstSave,
    FACT_DATE_LASTSAVE: params.dates?.lastSave,
    FACT_DATE_CALCCOST: null,
    FACT_DATE_EXPORT_ITM: null,
    FIRSTSTAGEBAD: null,
    FACT_DATE_PACK: null,
    FACT_DATE_ORDER_OUT: params.dates?.shipment,
    ORDER_STATUS: params.statuses?.oldStatus?.num,
    FACT_DATE_ORDER_CANCEL: params.dates?.orderCancel,
    REASON_ORDER_CANCEL: params.reasonCancel,
    USER_ORDER_CANCELED: params.userCanceled,
    ORDER_TYPE: params.orderType,
    TEXTURE_COMMENT: params.texture?.note,
    COLOR_LAK_COMMENT: params.varnish?.note,
    COLOR_PATINA_COMMENT: params.patina?.note,
    PRISAD:
      params.profile?.prisadka === true
        ? 'есть'
        : params.profile?.prisadka === false
          ? 'нет'
          : null,
    PLAN_DATE_FIRSTSTAGE: params.dates?.planFirstStage,
    PLAN_DATE_PACK: params.dates?.package,
    FILEPATH_CALC_CLIENT: null,
    FILEPATH_CALC_MANAGER: null,
    FILEPATH_BILL: null,
    VIEW_MOD: params.viewMode,
    TERMOSHOV:
      params.profile?.termoshov === true
        ? 'есть'
        : params.profile?.termoshov === false
          ? 'нет'
          : null,
    ASSEMBLY_ANGLE: params.profile?.angle,
  };

  const entries = Object.entries(fieldMap);
  const request = `
   insert into orders (
                  ${entries.map((entry) => entry[0]).join(', ')}
                )
                values (
                  ${entries.map(() => '?').join(', ')}
                )
              returning ID
  `;

  return [
    request,
    entries.map((entry) => {
      return Boolean(entry[1]) && entry[1] !== 'undefined' ? entry[1] : null;
    }),
  ];
};
