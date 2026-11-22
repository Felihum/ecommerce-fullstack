/* eslint-disable prettier/prettier */

import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  document: string;
}

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  externalReference: string;

  @IsInt()
  @Min(1)
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(86400)
  expiresInSeconds?: number;
}
