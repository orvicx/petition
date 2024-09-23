import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateCustomTokenDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?\d{10,15}$/, {
    message: 'Invalid phone number format',
  })
  phoneNumber: string;
}
