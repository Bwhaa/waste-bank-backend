import { PartialType } from '@nestjs/swagger'; // 👈 ใช้จาก Swagger เพื่อให้ Docs อัปเดตตาม
import { CreateWasteTypeDto } from './create-waste-type.dto';

export class UpdateWasteTypeDto extends PartialType(CreateWasteTypeDto) {}
