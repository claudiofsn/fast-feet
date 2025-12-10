import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EditUserUseCase } from '@/domain/application/use-cases/edit-user';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { EditDelivererDto } from '../dtos/edit-deliverer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/deliverers/:id')
@ApiTags('Deliverers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class EditDelivererController {
  constructor(private editUser: EditUserUseCase) {}

  @Put()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  async handle(@Body() body: EditDelivererDto, @Param('id') userId: string) {
    const { name, email } = body;

    await this.editUser.execute({
      userId,
      name,
      email,
    });
  }
}
