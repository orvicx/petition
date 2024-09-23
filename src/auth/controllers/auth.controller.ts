import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CreateCustomTokenDto } from '../dto/create-custom-token.dto';
import { ValidateIdTokenDto } from '../dto/validate-id-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 전화번호로 커스텀 토큰 생성
  @Post('custom-token')
  async getCustomToken(
    @Body() createCustomTokenDto: CreateCustomTokenDto,
  ): Promise<{ token: string }> {
    const { phoneNumber } = createCustomTokenDto;
    const token = await this.authService.createCustomToken(phoneNumber);
    return { token };
  }

  @Post('login')
  async login(
    @Body() validateIdTokenDto: ValidateIdTokenDto,
  ): Promise<{ accessToken: string }> {
    const { idToken } = validateIdTokenDto;
    const accessToken = await this.authService.validateFirebaseIdToken(idToken);
    return { accessToken };
  }
}
