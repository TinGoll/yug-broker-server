type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface ItmOrderDb {
  ID: number;
  MANAGER: string;
  CLIENT: string;
  ORDERNUM: string;
  ITM_ORDERNUM: string;
  FASAD_MAT: string;
  FASAD_MODEL: string;
  FASAD_PG_WIDTH: number;
  TEXTURE: string;
  FIL_MAT: string;
  FIL_MODEL: string;
  COLOR: string;
  FIL_COLOR: string;
  COLOR_TYPE: string;
  COLOR_LAK: string;
  COLOR_PATINA: string;
  ORDER_GENERALSQ: number;
  ORDER_FASADSQ: number;
  GLASS: string;
  PRIMECH?: any;
  ORDER_COST_PRICECOLUMN?: number;
  ORDER_COST: number;
  ORDER_PAY: number;
  ORDER_TOTAL_COST: number;
  ORDER_DISCOUNT: number;
  ORDER_DISCOUNT_COMMENT: string;
  ORDER_COSTUP: number;
  ORDER_COSTUP_COMMENT: string;
  ORDER_COST_PACK: number;
  ORDER_COST_GLASS?: any;
  FACT_DATE_RECEIVE?: any;
  FACT_DATE_FIRSTSAVE: string;
  FACT_DATE_LASTSAVE: string;
  FACT_DATE_CALCCOST: string;
  FACT_DATE_EXPORT_ITM: Date;
  FIRSTSTAGEBAD?: any;
  FACT_DATE_PACK?: string;
  FACT_DATE_ORDER_OUT?: string;
  ORDER_STATUS: number;
  FACT_DATE_ORDER_CANCEL?: string;
  REASON_ORDER_CANCEL?: string;
  USER_ORDER_CANCELED?: string;
  ORDER_TYPE: string;
  TEXTURE_COMMENT?: string;
  COLOR_LAK_COMMENT?: string;
  COLOR_PATINA_COMMENT?: string;
  PRISAD: string;
  PLAN_DATE_FIRSTSTAGE: Date;
  PLAN_DATE_PACK: Date;
  FILEPATH_CALC_CLIENT: string;
  FILEPATH_CALC_MANAGER: string;
  FILEPATH_BILL?: string;
  VIEW_MOD: string;
  TERMOSHOV: string;
  ASSEMBLY_ANGLE: string;
  CLIENT_ID: number;
  CLIENTNAME: string;
  CLIENT_SITY: string;
  CLIENT_PHONE1: string;
  CLIENT_PHONE2?: string;
  CLIENT_SHORTNAME: string;
  CLIENT_EMAIL1: string;
  CLIENT_EMAIL2?: string;
  CLIENT_COMMENT?: string;
  ID_SECTOR: number;
  SECTOR: string;
  STATUS: string;
  JSTATUS?: string;
}

export interface ItmOrderElementDb {
  ID: number;
  ORDER_ID: number;
  NAME: string;
  HEIGHT: string;
  WIDTH: string;
  EL_COUNT: number;
  SQUARE: number;
  COMMENT: string;
  CALC_AS: string;
  MOD_PRICE: string;
  PRICE_COST: number;
  COST: string;
  COST_SNG?: number;
  CALC_COMMENT: string;
}

export interface ItmOrderDataPlanDb {
  ID: number;
  ORDER_ID: number;
  DATE_SECTOR: string;
  DATE_DESCRIPTION: string;
  SECTOR: string;
  COMMENT: string;
  DATE3: Date;
  DATE2?: Date;
}

// *******************************************

export interface ItmAuthor {
  userName: string;
}

export interface ItmClient {
  id: number;
  name: string;
  sity: string;
  phones: Array<string>;
  shortName: string;
  emails: Array<string>;
  note?: string;
}

export interface ItmMaterial {
  name: string;
}

export interface ItmProfile {
  name: string;
  widths: Array<number>;
  angle: string;
  prisadka: boolean;
  termoshov: boolean;
}

export interface ItmPanel {
  name: string;
  color?: ItmColor;
  material?: ItmMaterial;
}

export interface ItmOrderResult {
  generalSquare: number;
  fasadeSquare: number;
  elementCount: number;
}

export interface ItmOrderPayments {
  priceColumn?: number;
  cost: number;
  totalCost: number;
  payment: number;
  discount?: number;
  discountComment?: string;
  costUp?: number;
  costUpComment?: string;
  costPack?: number;
  costGlass?: number;
}

export interface ItmDates {
  receive?: string;
  firstSave: string;
  lastSave: string;
  recalculationCost: string;
  package?: string;
  shipment: string;
  orderCancel?: string;
  firstStage?: string;
  planFirstStage: string;
}

export interface ItmStatuses {
  oldStatus: {
    num: number;
    name: string;
  };
  status: string;
}

export interface ItmTexure {
  name: string;
  note?: string;
}

export interface ItmColor {
  name: string;
  type?: string;
  note?: string;
}

export interface ItmVarnish {
  name: string;
  note?: string;
}

export interface ItmPatina {
  name: string;
  note?: string;
}

export interface ItmLocation {
  sector: ItmSector;
}

export interface ItmSector {
  id: number;
  name: string;
}

export interface ItmGeometry {
  height?: number;
  width?: number;
  depht?: number;
  amount: number;
  square: number;
  linearMeters: number;
  cubature: number;
  perimeter: number;
}

export interface ItmElementPayments {
  calcAs: string;
  priceModifer: string;
  priceCost: number;
  cost: number;
  costSng: number;
  note?: string;
}

export interface ItmElement {
  id: number;
  orderId: number;
  name: string;
  note?: string;
  value: number;
  geometry: ItmGeometry;
  payments: ItmElementPayments;
}

interface ItmOrder {
  id: number;
  author: ItmAuthor;
  client: ItmClient;
  clientNumber: string;
  itmOrderNumber: string;
  orderType: string;
  note: string;
  material: ItmMaterial;
  profile: ItmProfile;
  texture: ItmTexure;
  glass: string;
  panel: ItmPanel;
  color: ItmColor;
  varnish: ItmVarnish;
  patina: ItmPatina;
  orderResult: ItmOrderResult;
  orderPayments: ItmOrderPayments;
  dates: ItmDates;
  statuses: ItmStatuses;
  reasonCancel?: string;
  userCanceled?: string;
  viewMode: string;
  location: ItmLocation;
  elements: ItmElement[];
}

export type SaveItmOrderIn = DeepPartial<ItmOrder>;
export interface UpdateItmOrderIn extends DeepPartial<ItmOrder> {
  id: number;
}
export type CreateItmOrderIn = DeepPartial<ItmOrder>;
export type CreateItmElementIn = DeepPartial<ItmElement>;
