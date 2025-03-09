import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { from, Observable, of } from 'rxjs';
import { HttpExceptionFilter } from 'src/filters/http-exception-filter';
import {
  CreateItmOrderIn,
  ItmOrder,
  UpdateItmOrderIn,
} from '../interfaces/itm-order.types';
import { OrderService } from '../services/order.service';

@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':id')
  @HttpCode(200)
  @UseFilters(HttpExceptionFilter)
  findOne(@Param('id') id: string): Promise<ItmOrder> {
    return this.orderService.findOne({
      where: {
        ID: Number(id),
      },
    });
  }

  @Post()
  @HttpCode(201)
  @UseFilters(HttpExceptionFilter)
  create(@Body() createItmOrderIn: CreateItmOrderIn): Promise<number> {
    return this.orderService.create(createItmOrderIn);
  }

  @Patch()
  @UseFilters(HttpExceptionFilter)
  update(@Body() updateItmOrderIn: UpdateItmOrderIn): Promise<void> {
    return this.orderService.update(updateItmOrderIn);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseFilters(HttpExceptionFilter)
  delete(@Param('id') id: string): Promise<void> {
    return this.orderService.delete(Number(id));
  }
}
