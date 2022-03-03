import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { CreateHostelDto, CreateRoomDto, HostelSearchFieldsDto } from './dtos/hostels-dtos';
import { HostelsService } from './hostels.service';

@Controller('hostels')
export class HostelsController {
  constructor(private readonly hostelsService: HostelsService) {}

  @Post("/create")
  public async createHostel(@Body() createRequest: CreateHostelDto) {
    return this.hostelsService.createHostel(createRequest);
  }

  @Post("/room/create")
  public async createRoom(@Body() createRequest: CreateRoomDto) {
    return this.hostelsService.createRoom(createRequest);
  }

  @Get("/get-allocations")
  public async getHostelAllocations() {
    return this.hostelsService.getHostelAllocations();
  }

  @Get("/search")
  public async filterHostel(@Query(new ValidationPipe({ whitelist: true, transform: true })) query: HostelSearchFieldsDto) {
    return this.hostelsService.filterHostel(query);
  }
}
