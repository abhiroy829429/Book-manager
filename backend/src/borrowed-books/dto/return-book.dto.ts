import { IsNotEmpty, IsUUID } from 'class-validator';

export class ReturnBookDto {
  @IsNotEmpty()
  @IsUUID()
  borrowedBookId: string;
}

