import { Injectable } from '@nestjs/common';
import {
  ItmAuthor,
  ItmClient,
  ItmColor,
  ItmDates,
  ItmElement,
  ItmElementPayments,
  ItmGeometry,
  ItmLocation,
  ItmMaterial,
  ItmOrder,
  ItmOrderDataPlanDb,
  ItmOrderDb,
  ItmOrderElementDb,
  ItmOrderPayments,
  ItmOrderResult,
  ItmPanel,
  ItmPatina,
  ItmProfile,
  ItmStatuses,
  ItmTexure,
  ItmVarnish,
} from '../interfaces/itm-order.types';

@Injectable()
export class Converter {
  // Точность геометрических показателей
  private accuracy = 4;
  // Точность денежных показателей.
  private currencyAccuracy = 2;
  dbDataToOrder(
    dbData: ItmOrderDb,
    plans: ItmOrderDataPlanDb[],
    elements: ItmOrderElementDb[],
  ): ItmOrder {
    const author: ItmAuthor = {
      userName: dbData.MANAGER,
    };

    const client: ItmClient = {
      id: dbData.CLIENT_ID,
      name: dbData.CLIENTNAME,
      sity: dbData.CLIENT_SITY,
      shortName: dbData.CLIENT_SHORTNAME,
      phones: [],
      emails: [],
      note: dbData.CLIENT_COMMENT || undefined,
    };

    if (dbData.CLIENT_PHONE1) client.phones.push(dbData.CLIENT_PHONE1);
    if (dbData.CLIENT_PHONE2) client.phones.push(dbData.CLIENT_PHONE2);
    if (dbData.CLIENT_EMAIL1) client.emails.push(dbData.CLIENT_EMAIL1);
    if (dbData.CLIENT_EMAIL2) client.emails.push(dbData.CLIENT_EMAIL2);

    let material: ItmMaterial;
    if (dbData.FASAD_MAT) material = { name: dbData.FASAD_MAT };

    let profile: ItmProfile;
    if (dbData.FASAD_MODEL) {
      profile = {
        name: dbData.FASAD_MODEL,
        angle: dbData.ASSEMBLY_ANGLE,
        prisadka: Boolean(dbData.PRISAD),
        termoshov: Boolean(dbData.TERMOSHOV),
        widths: [],
      };
      if (dbData.FASAD_PG_WIDTH) {
        profile.widths.push(dbData.FASAD_PG_WIDTH);
      } else {
        if (dbData.FASAD_MODEL === 'Портофино') {
          profile.widths.push(70);
          profile.widths.push(50);
        }
      }
    }

    let texture: ItmTexure;
    if (dbData.TEXTURE) {
      texture = {
        name: dbData.TEXTURE,
        note: dbData.TEXTURE_COMMENT || undefined,
      };
    }

    let panel: ItmPanel;
    if (dbData.FIL_MODEL) {
      panel = {
        name: dbData.FIL_MODEL,
      };
      if (dbData.FIL_COLOR) {
        panel.color = {
          name: dbData.FIL_COLOR,
        };
      }
      if (dbData.FIL_MAT) {
        panel.material = {
          name: dbData.FIL_MAT,
        };
      }
    }

    let color: ItmColor;
    if (dbData.COLOR) {
      color = {
        name: dbData.COLOR,
        type: dbData.COLOR_TYPE || undefined,
      };
    }
    let varnish: ItmVarnish;

    if (dbData.COLOR_LAK) {
      varnish = {
        name: dbData.COLOR_LAK,
        note: dbData.COLOR_LAK_COMMENT || undefined,
      };
    }

    let patina: ItmPatina;
    if (dbData.COLOR_PATINA) {
      patina = {
        name: dbData.COLOR_PATINA,
        note: dbData.COLOR_PATINA_COMMENT || undefined,
      };
    }

    const orderResult: ItmOrderResult = {
      generalSquare: Number(
        (dbData.ORDER_GENERALSQ || 0).toFixed(this.currencyAccuracy),
      ),
      fasadeSquare: Number(
        (dbData.ORDER_FASADSQ || 0).toFixed(this.currencyAccuracy),
      ),
      elementCount: 0,
    };

    const orderPayments: ItmOrderPayments = {
      priceColumn: dbData.ORDER_COST_PRICECOLUMN || undefined,
      cost: Number((dbData.ORDER_COST || 0).toFixed(this.currencyAccuracy)),
      totalCost: Number(
        (dbData.ORDER_TOTAL_COST || 0).toFixed(this.currencyAccuracy),
      ),
      payment: Number((dbData.ORDER_PAY || 0).toFixed(this.currencyAccuracy)),
      discount: dbData.ORDER_DISCOUNT || 0,
      discountComment: dbData.ORDER_DISCOUNT_COMMENT || undefined,
      costUp: dbData.ORDER_COSTUP || 0,
      costUpComment: dbData.ORDER_COSTUP_COMMENT || undefined,
      costPack: dbData.ORDER_COST_PACK || 0,
      costGlass: dbData.ORDER_COST_GLASS || undefined,
    };

    const dates: ItmDates = {
      receive: dbData.FACT_DATE_RECEIVE || undefined,
      firstSave: dbData.FACT_DATE_FIRSTSAVE,
      lastSave: dbData.FACT_DATE_LASTSAVE,
      recalculationCost: dbData.FACT_DATE_CALCCOST,
      package: dbData.FACT_DATE_PACK,
      shipment: dbData.FACT_DATE_ORDER_OUT,
      orderCancel: dbData.FACT_DATE_ORDER_CANCEL,
      firstStage: dbData.FACT_DATE_FIRSTSAVE,
      planFirstStage: String(dbData.PLAN_DATE_FIRSTSTAGE),
    };

    const statuses: ItmStatuses = {
      oldStatus: {
        num: dbData.ORDER_STATUS,
        name: dbData.STATUS,
      },
      status: dbData.JSTATUS || undefined,
    };

    let location: ItmLocation;
    if (dbData.ID_SECTOR) {
      location = {
        sector: {
          id: dbData.ID_SECTOR,
          name: dbData.SECTOR,
        },
      };
    }

    const order: ItmOrder = {
      id: dbData.ID,
      author: author,
      client: client,
      clientNumber: dbData.ORDERNUM,
      itmOrderNumber: dbData.ITM_ORDERNUM,
      orderType: dbData.ORDER_TYPE,
      note: dbData.PRIMECH,
      material: material,
      profile: profile,
      texture: texture,
      panel: panel,
      color: color,
      varnish: varnish,
      patina: patina,
      orderResult: orderResult,
      orderPayments: orderPayments,
      dates: dates,
      statuses: statuses,
      viewMode: dbData.VIEW_MOD,
      location: location,
      elements: [],
    };
    order.elements = elements.map((e) => this.dbDataToElement(e));
    order.orderResult.elementCount = order.elements.reduce<number>((acc, e) => {
      acc += Number(e.geometry?.amount);
      return acc;
    }, 0);
    return order;
  }

  dbDataToElement(dbData: ItmOrderElementDb): ItmElement {
    const rg = new RegExp(/[\d+]*[.,]?[\d+]+(\*[\d+]*[.,]?[\d+]+)/, 'g');
    let widthArr = dbData.WIDTH?.split('*') || [];
    const rgRes = dbData?.NAME?.match(rg);
    if (rgRes) {
      widthArr = rgRes[0].split('*') || [];
    }

    let height: number;
    let width: number;
    let depht: number;

    if (dbData.HEIGHT === '0') {
      height = 0;
    } else {
      height = dbData.HEIGHT ? Number(dbData.HEIGHT) : undefined;
    }

    if (widthArr[0] === '0') {
      width = 0;
    } else {
      width = widthArr[0] ? Number(widthArr[0]) : undefined;
    }

    if (widthArr[1] === '0') {
      depht = 0;
    } else {
      depht = widthArr[1] ? Number(widthArr[1]) : undefined;
    }

    const geometry: ItmGeometry = {
      height,
      width,
      depht,
      amount: dbData.EL_COUNT,
      square: 0,
      linearMeters: 0,
      cubature: 0,
      perimeter: 0,
    };

    geometry.square =
      this.getSquare(geometry.height, geometry.width) * geometry.amount;
    geometry.cubature =
      this.getCubature(geometry.height, geometry.width, geometry.depht) *
      geometry.amount;
    geometry.perimeter =
      this.getPerimeter(geometry.height, geometry.width) * geometry.amount;
    geometry.linearMeters = this.getLinearMeters(geometry.height);

    const payments: ItmElementPayments = {
      calcAs: dbData.CALC_AS,
      priceModifer: dbData.MOD_PRICE,
      priceCost: Number(dbData.PRICE_COST),
      cost: Number(dbData.COST),
      costSng: Number(dbData.COST_SNG),
      note: dbData.CALC_COMMENT,
    };

    const element: ItmElement = {
      id: dbData.ID,
      orderId: dbData.ORDER_ID,
      name: dbData.NAME,
      note: dbData.COMMENT
        ? String(dbData.COMMENT).replace(/\s+/g, ' ').trim()
        : undefined,
      value: Number(dbData.SQUARE),
      geometry: geometry,
      payments: payments,
    };
    return element;
  }

  getSquare(height: number | undefined, width: number | undefined): number {
    const h = height || 0;
    const w = width || 0;
    const mm = 1000;
    return Number(((h / mm) * (w / mm)).toFixed(3));
  }

  getCubature(
    height: number | undefined,
    width: number | undefined,
    depth: number | undefined,
  ): number {
    const h = height || 0;
    const w = width || 0;
    const d = depth || 0;
    const mm = 1000;
    return Number(((h / mm) * (w / mm) * (d / mm)).toFixed(this.accuracy));
  }

  getPerimeter(height: number | undefined, width: number | undefined): number {
    const h = height || 0;
    const w = width || 0;
    const mm = 1000;
    return Number(((h / mm) * 2 + (w / mm) * 2).toFixed(this.accuracy));
  }

  getLinearMeters(height: number | undefined): number {
    const h = height || 0;
    const mm = 1000;
    return Number((h / mm).toFixed(this.accuracy));
  }
}
