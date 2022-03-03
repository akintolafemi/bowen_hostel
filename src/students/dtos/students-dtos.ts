import { IsNotEmpty, IsString, MinLength, IsAlphanumeric, IsInt } from "class-validator";

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  studentid: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be a minimum of 8 alphanumeric characters'
  })
  password: string;
}

export class AssignRoomDto {
  @IsInt()
  @IsNotEmpty()
  room_id: number;
}