import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ example: 'BuildMax Supplies' })
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiProperty({ example: '+91-9876543210' })
  @IsString()
  @Length(7, 20)
  phone!: string;

  @ApiProperty({ example: 'Industrial Area Phase 2' })
  @IsString()
  @Length(5, 255)
  address!: string;
}
