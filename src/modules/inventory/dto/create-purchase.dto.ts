import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumberString,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreatePurchaseItemDto {
  @ApiProperty({ example: '2f0b93df-ff6f-4c91-a526-bca5e2ab4fb4' })
  @IsString()
  itemId!: string;

  @ApiProperty({ example: '200.00' })
  @IsNumberString()
  quantity!: string;

  @ApiProperty({ example: '305.00' })
  @IsNumberString()
  costPrice!: string;
}

export class CreatePurchaseDto {
  @ApiProperty({ example: 'd66f1eec-a9f5-4c6f-b51a-5bd35e937aa0' })
  @IsString()
  supplierId!: string;

  @ApiProperty({ type: [CreatePurchaseItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemDto)
  items!: CreatePurchaseItemDto[];
}
