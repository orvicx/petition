import { IsString, IsOptional } from 'class-validator';

export class GeneratePdfDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  signatureUrl?: string;

  @IsOptional()
  @IsString()
  idCardUrl?: string;
}
