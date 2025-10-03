import { IsString } from 'class-validator'

export class CreateOrderServiceDto {
  @IsString()
  description: string;

  @IsString()
  checklist: string;
}

