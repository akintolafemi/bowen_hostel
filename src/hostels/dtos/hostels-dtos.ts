import { IsNotEmpty, IsString, IsInt, IsOptional } from "class-validator";

export class CreateHostelDto {
  @IsString()
  @IsNotEmpty()
  hostel_name: string;

  @IsString()
  @IsNotEmpty()
  hostel_location: string;

  @IsInt()
  @IsOptional()
  total_available_rooms: number;
}

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  room_name: string;

  @IsInt()
  @IsNotEmpty()
  hostel_id : number;

  @IsInt()
  @IsOptional()
  total_beds : number;
}

export class HostelSearchFieldsDto {
  @IsString()
  @IsOptional()
  hostel_name: string;

  @IsString()
  @IsOptional()
  total_available_rooms: string;

  @IsString()
  @IsOptional()
  is_available: string;
}
