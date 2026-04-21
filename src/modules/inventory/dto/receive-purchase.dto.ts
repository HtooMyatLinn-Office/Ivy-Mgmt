import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class ReceivePurchaseDto {
  @ApiProperty({ required: false, example: '2026-04-10T10:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  receivedDate?: string;
}
