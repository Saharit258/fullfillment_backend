import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  sku: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  details: string;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
