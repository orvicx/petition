import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreatePetitionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  situationId: string;

  @IsUrl()
  @IsNotEmpty()
  signatureUrl: string;

  @IsUrl()
  @IsNotEmpty()
  idCardUrl: string;
}
