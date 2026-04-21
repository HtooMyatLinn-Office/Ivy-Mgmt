import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { CreatePurchaseDto } from './create-purchase.dto';

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {
  @ApiProperty({ required: false, example: '2026-04-21T09:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  orderDate?: string;

  @ApiProperty({ required: false, example: '2026-04-22T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  deliveryDate?: string;
}
