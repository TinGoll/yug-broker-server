import { Controller, Get } from '@nestjs/common';

@Controller('api/itm')
export class ItmController {

    @Get('/test')
    test() {
        return Promise.resolve('the server is running');
    }
}
