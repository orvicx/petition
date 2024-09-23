import { IsString, IsOptional } from 'class-validator';

export class UpdatePetitionDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  signatureUrl?: string;

  @IsOptional()
  @IsString()
  idCardUrl?: string;
}
