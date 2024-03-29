import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  shipperCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  shipperName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  zipCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email: string;
}
