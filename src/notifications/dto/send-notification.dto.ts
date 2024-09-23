import {
  IsArray,
  IsString,
  ValidateNested,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class NotificationPayloadDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  data?: { [key: string]: string };
}

export class SendNotificationDto {
  @IsArray()
  @IsString({ each: true })
  registrationTokens: string[];

  @ValidateNested()
  @Type(() => NotificationPayloadDto)
  payload: NotificationPayloadDto;
}
