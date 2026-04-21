import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export enum DeliveryStatusDto {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  RECEIVED = 'RECEIVED',
  PARTIAL = 'PARTIAL',
  CANCELLED = 'CANCELLED',
}

export class CreateDeliveryItemDto {
  @ApiProperty({ example: '2f0b93df-ff6f-4c91-a526-bca5e2ab4fb4' })
  @IsString()
  itemId!: string;

  @ApiProperty({ example: '200.00' })
  @IsNumberString()
  orderedQty!: string;

  @ApiProperty({ example: '198.00' })
  @IsNumberString()
  deliveredQty!: string;

  @ApiProperty({ example: '196.00' })
  @IsNumberString()
  acceptedQty!: string;

  @ApiProperty({ required: false, example: '2.00' })
  @IsOptional()
  @IsNumberString()
  damagedQty?: string;

  @ApiProperty({ required: false, example: '2 bags wet on arrival' })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  remarks?: string;
}

export class CreateDeliveryDto {
  @ApiProperty({ example: 'd66f1eec-a9f5-4c6f-b51a-5bd35e937aa0' })
  @IsString()
  supplierId!: string;

  @ApiProperty({ example: 'buyer_adam_01' })
  @IsString()
  @Length(1, 120)
  buyerId!: string;

  @ApiProperty({ example: 'shop_lagos_01' })
  @IsString()
  @Length(1, 120)
  shopId!: string;

  @ApiProperty({ example: 'Truck' })
  @IsString()
  @Length(2, 80)
  vehicleType!: string;

  @ApiProperty({ example: 'KJA-234-AB' })
  @IsString()
  @Length(2, 40)
  vehicleNumber!: string;

  @ApiProperty({ example: 'John Driver' })
  @IsString()
  @Length(2, 120)
  driverName!: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsString()
  @Length(7, 25)
  driverPhone!: string;

  @ApiProperty({ enum: DeliveryStatusDto, required: false, example: DeliveryStatusDto.IN_TRANSIT })
  @IsOptional()
  @IsEnum(DeliveryStatusDto)
  status?: DeliveryStatusDto;

  @ApiProperty({ required: false, example: '2026-04-22T10:15:00.000Z' })
  @IsOptional()
  @IsDateString()
  deliveredAt?: string;

  @ApiProperty({ required: false, example: 'Initial delivery manifest uploaded.' })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  notes?: string;

  @ApiProperty({ type: [CreateDeliveryItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDeliveryItemDto)
  items!: CreateDeliveryItemDto[];
}
