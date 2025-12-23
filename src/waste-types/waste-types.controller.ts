import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WasteTypesService } from './waste-types.service';
import { CreateWasteTypeDto } from './dto/create-waste-type.dto';
import { UpdateWasteTypeDto } from './dto/update-waste-type.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { WasteType } from '@prisma/client';

@ApiTags('Waste Types (Master Data)')
@Controller('waste-types')
export class WasteTypesController {
  constructor(private readonly wasteTypesService: WasteTypesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'สร้างประเภทขยะใหม่ (Admin Only)' })
  @ApiResponse({
    status: 201,
    description: 'สร้างสำเร็จ',
    type: CreateWasteTypeDto,
  })
  @ApiResponse({
    status: 400,
    description: 'ข้อมูลไม่ถูกต้อง (Validation Error)',
  })
  @ApiResponse({ status: 409, description: 'ชื่อขยะซ้ำกัน (Duplicate)' })
  async create(
    @Body() createWasteTypeDto: CreateWasteTypeDto,
  ): Promise<WasteType> {
    return this.wasteTypesService.create(createWasteTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงรายการขยะทั้งหมด (Public)' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลสำเร็จ' })
  async findAll(): Promise<WasteType[]> {
    return this.wasteTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดูรายละเอียดขยะตาม ID' })
  @ApiResponse({ status: 200, description: 'เจอข้อมูล' })
  @ApiResponse({ status: 404, description: 'ไม่พบข้อมูล (Not found)' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<WasteType> {
    return this.wasteTypesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'แก้ไขราคา/ข้อมูลขยะ (Admin Only)' })
  @ApiResponse({ status: 200, description: 'แก้ไขสำเร็จ' })
  @ApiResponse({ status: 400, description: 'Validation Error' })
  @ApiResponse({ status: 404, description: 'ไม่พบข้อมูล' })
  @ApiResponse({ status: 409, description: 'ชื่อซ้ำ' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWasteTypeDto: UpdateWasteTypeDto,
  ): Promise<WasteType> {
    return this.wasteTypesService.update(id, updateWasteTypeDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ลบประเภทขยะ (Soft Delete)' })
  @ApiResponse({ status: 200, description: 'ลบสำเร็จ (Soft Delete)' })
  @ApiResponse({ status: 404, description: 'ไม่พบข้อมูล หรือถูกลบไปแล้ว' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<WasteType> {
    return this.wasteTypesService.remove(id);
  }
}
