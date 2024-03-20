import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateHistoryDto {
  @IsString()
  @IsNotEmpty()
  order: string;
  @IsString()
  @IsNotEmpty()
  note: string;
  @IsDate()
  @IsNotEmpty()
  outDate: Date;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
  @IsString()
  @IsNotEmpty()
  remark: string;
}
