import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.episodesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.episodesService.findOne(id);
  }
}
