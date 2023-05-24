import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { from, Observable, of } from 'rxjs';
import { HttpExceptionFilter } from 'src/filters/http-exception-filter';
import { ItmOrder } from '../interfaces/itm-order.types';
import { OrderService } from '../services/order.service';

@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':id')
  @UseFilters(new HttpExceptionFilter())
  findOne(@Param('id') id): Observable<ItmOrder> {
    return from(
      this.orderService.findOne({
        where: {
          ID: Number(id),
        },
      }),
    );
  }
}
