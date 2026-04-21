import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorId } from '../../../common/decorators/actor-id.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { INVENTORY_SERVICE, InventoryServiceContract } from '../services/inventory.service.interface';

@ApiTags('Inventory')
@ApiHeader({ name: 'x-user-id', required: false, description: 'Actor identity for audit trail' })
@Controller('inventory/suppliers')
export class SuppliersController {
  constructor(
    @Inject(INVENTORY_SERVICE)
    private readonly service: InventoryServiceContract,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supplier' })
  create(@Body() dto: CreateSupplierDto, @ActorId() actorId: string) {
    return this.service.createSupplier(dto, { actorId });
  }

  @Get()
  @ApiOperation({ summary: 'List suppliers with pagination' })
  list(@Query() query: PaginationQueryDto) {
    return this.service.listSuppliers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supplier details by id' })
  getById(@Param('id') id: string) {
    return this.service.getSupplierById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a supplier' })
  update(@Param('id') id: string, @Body() dto: UpdateSupplierDto, @ActorId() actorId: string) {
    return this.service.updateSupplier(id, dto, { actorId });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a supplier' })
  remove(@Param('id') id: string) {
    return this.service.deleteSupplier(id);
  }
}
