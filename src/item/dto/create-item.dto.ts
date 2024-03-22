import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  sku: string;
  @IsString()
  name: string;
  @IsString()
  details: string;
}
