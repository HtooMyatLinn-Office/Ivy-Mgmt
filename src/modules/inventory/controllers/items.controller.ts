import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorId } from '../../../common/decorators/actor-id.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { INVENTORY_SERVICE, InventoryServiceContract } from '../services/inventory.service.interface';

@ApiTags('Inventory')
@ApiHeader({ name: 'x-user-id', required: false, description: 'Actor identity for audit trail' })
@Controller('inventory/items')
export class ItemsController {
  constructor(
    @Inject(INVENTORY_SERVICE)
    private readonly service: InventoryServiceContract,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inventory item' })
  create(@Body() dto: CreateItemDto, @ActorId() actorId: string) {
    return this.service.createItem(dto, { actorId });
  }

  @Get()
  @ApiOperation({ summary: 'List inventory items with pagination' })
  list(@Query() query: PaginationQueryDto) {
    return this.service.listItems(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item details by id' })
  getById(@Param('id') id: string) {
    return this.service.getItemById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an inventory item' })
  update(@Param('id') id: string, @Body() dto: UpdateItemDto, @ActorId() actorId: string) {
    return this.service.updateItem(id, dto, { actorId });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an inventory item' })
  remove(@Param('id') id: string) {
    return this.service.deleteItem(id);
  }
}
