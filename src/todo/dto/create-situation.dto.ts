import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSituationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
