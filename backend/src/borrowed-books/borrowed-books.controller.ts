import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Borrowed Books')
@ApiBearerAuth()
@Controller('borrowed-books')
@UseGuards(JwtAuthGuard)
export class BorrowedBooksController {
  constructor(private readonly borrowedBooksService: BorrowedBooksService) {}

  @Post('borrow')
  borrow(@Body() borrowBookDto: BorrowBookDto) {
    return this.borrowedBooksService.borrow(borrowBookDto);
  }

  @Post('return')
  return(@Body() returnBookDto: ReturnBookDto) {
    return this.borrowedBooksService.return(returnBookDto.borrowedBookId);
  }

  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.borrowedBooksService.findAllByUser(userId);
  }

  @Get()
  findAll() {
    return this.borrowedBooksService.findAll();
  }
}

