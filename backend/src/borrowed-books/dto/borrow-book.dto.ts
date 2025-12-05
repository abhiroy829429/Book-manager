import { IsNotEmpty, IsUUID } from 'class-validator';

export class BorrowBookDto {
  @IsNotEmpty()
  @IsUUID()
  bookId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

