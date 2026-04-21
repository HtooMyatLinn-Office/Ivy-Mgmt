import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class ReceiveDeliveryItemDto {
  @ApiProperty({ example: '2f0b93df-ff6f-4c91-a526-bca5e2ab4fb4' })
  @IsString()
  itemId!: string;

  @ApiProperty({ example: '198.00' })
  @IsNumberString()
  acceptedQty!: string;

  @ApiProperty({ required: false, example: '2.00' })
  @IsOptional()
  @IsNumberString()
  damagedQty?: string;

  @ApiProperty({ required: false, example: 'Accepted with minor packaging damage.' })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  remarks?: string;
}

export class ReceiveDeliveryDto {
  @ApiProperty({ required: false, example: '2026-04-22T11:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  receivedAt?: string;

  @ApiProperty({ required: false, example: 'Gate pass verified before unloading.' })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  notes?: string;

  @ApiProperty({ type: [ReceiveDeliveryItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReceiveDeliveryItemDto)
  items?: ReceiveDeliveryItemDto[];
}
