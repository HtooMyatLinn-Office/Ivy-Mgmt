import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { INVENTORY_SERVICE, InventoryServiceContract } from '../services/inventory.service.interface';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(
    @Inject(INVENTORY_SERVICE)
    private readonly service: InventoryServiceContract,
  ) {}

  @Get('stock')
  @ApiOperation({ summary: 'Get current inventory stock' })
  stock(@Query() query: PaginationQueryDto) {
    return this.service.getInventory(query);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock alerts' })
  lowStock(@Query() query: PaginationQueryDto) {
    return this.service.getLowStock(query);
  }
}
