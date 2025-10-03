import { IsOptional, IsString } from 'class-validator';

export class UpdateOrderServiceDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  checklist?: string;

  @IsOptional()
  existingPhotos?: string;

  @IsOptional()
  photos?: any;
}
