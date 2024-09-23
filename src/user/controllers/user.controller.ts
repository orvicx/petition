import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreatePetitionDto } from '../dto/create-petition.dto';
import { UpdatePetitionDto } from '../dto/update-petition.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('petition')
  async createPetition(
    @Body() createPetitionDto: CreatePetitionDto,
    @Req() req: any,
  ): Promise<{ petitionId: string }> {
    const userId = req.user.uid;
    const petitionData = {
      ...createPetitionDto,
      userId,
    };
    const petitionId = await this.userService.createPetition(petitionData);
    return { petitionId };
  }

  @UseGuards(JwtAuthGuard)
  @Get('petition/:id')
  async getPetition(@Param('id') petitionId: string) {
    return await this.userService.getPetition(petitionId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('petition/:id')
  async updatePetition(
    @Param('id') petitionId: string,
    @Body() updatePetitionDto: UpdatePetitionDto,
  ) {
    await this.userService.updatePetition(petitionId, updatePetitionDto);
    return { message: 'Petition updated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload/:type')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ fileUrl: string }> {
    const allowedTypes = ['idCard', 'signature'];
    if (!allowedTypes.includes(type)) {
      throw new BadRequestException('Invalid file type');
    }

    const folder = type === 'idCard' ? 'idCards' : 'signatures';
    const fileUrl = await this.userService.uploadFile(file, folder);
    return { fileUrl };
  }
}
