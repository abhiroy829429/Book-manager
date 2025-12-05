import { IsOptional, IsString, IsBoolean, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterBooksDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsString()
  publishedFrom?: string;

  @IsOptional()
  @IsString()
  publishedTo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

