import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import reverseString from './utils/reverse-string.utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/reverse-string")
  createHostel(@Body() req: any): string {
    return reverseString(req.str);
  }
}

