import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class HistoryFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  startDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  endDate: Date;
}
