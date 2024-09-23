import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateIdTokenDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
