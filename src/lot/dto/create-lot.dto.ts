import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLotDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsDate()
  @IsNotEmpty()
  incomingDate: Date;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
