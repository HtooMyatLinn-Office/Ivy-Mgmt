import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, Length } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ example: 'Portland Cement' })
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiProperty({ example: 'Cement' })
  @IsString()
  @Length(2, 80)
  category!: string;

  @ApiProperty({ example: 'bag' })
  @IsString()
  @Length(1, 20)
  unit!: string;

  @ApiProperty({ example: '310.00' })
  @IsNumberString()
  costPrice!: string;

  @ApiProperty({ example: '360.00' })
  @IsNumberString()
  sellingPrice!: string;

  @ApiProperty({ example: '120.00' })
  @IsNumberString()
  minStockLevel!: string;
}
