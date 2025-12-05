import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  bio?: string;
}

