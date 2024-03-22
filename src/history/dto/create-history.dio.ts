import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { item } from 'src/entities/item.entity';

export class CreateHistoryDto {
  @IsString()
  @IsNotEmpty()
  order: string;
  @IsString()
  @IsNotEmpty()
  note: string;
  outDate: Date;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
  @IsString()
  @IsNotEmpty()
  remark: string;
  item: number;
}
