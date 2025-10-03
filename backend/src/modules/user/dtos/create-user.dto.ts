import { IsNotEmpty, IsString } from "class-validator";

export class RegisterUsersDto {
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}