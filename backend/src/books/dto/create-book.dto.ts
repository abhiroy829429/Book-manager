import { IsNotEmpty, IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsNotEmpty()
  @IsUUID()
  authorId: string;
}

