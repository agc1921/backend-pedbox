import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.locationsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.findOne(id);
  }
}
