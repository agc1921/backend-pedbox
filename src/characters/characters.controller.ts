import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.charactersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.findOne(id);
  }
}
