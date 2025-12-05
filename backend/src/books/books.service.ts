import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    const publishedAt = createBookDto.publishedAt
      ? new Date(createBookDto.publishedAt)
      : null;

    return this.prisma.book.create({
      data: {
        title: createBookDto.title,
        isbn: createBookDto.isbn,
        publishedAt,
        authorId: createBookDto.authorId,
      },
      include: {
        author: true,
      },
    });
  }

  async findAll(filterDto: FilterBooksDto) {
    const {
      search,
      authorId,
      available,
      publishedFrom,
      publishedTo,
      page = 1,
      limit = 10,
    } = filterDto;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (publishedFrom || publishedTo) {
      where.publishedAt = {};
      if (publishedFrom) {
        where.publishedAt.gte = new Date(publishedFrom);
      }
      if (publishedTo) {
        where.publishedAt.lte = new Date(publishedTo);
      }
    }

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: {
          author: true,
          borrowedBooks: {
            where: {
              returnedAt: null,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.book.count({ where }),
    ]);

    // Filter by availability if specified
    let filteredBooks = books;
    if (available !== undefined) {
      filteredBooks = books.filter((book) => {
        const isBorrowed = book.borrowedBooks.length > 0;
        return available ? !isBorrowed : isBorrowed;
      });
    }

    return {
      data: filteredBooks.map((book) => ({
        ...book,
        isAvailable: book.borrowedBooks.length === 0,
        borrowedBooks: undefined,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        borrowedBooks: {
          where: {
            returnedAt: null,
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return {
      ...book,
      isAvailable: book.borrowedBooks.length === 0,
    };
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    const data: any = {
      title: updateBookDto.title,
      isbn: updateBookDto.isbn,
      authorId: updateBookDto.authorId,
    };

    if (updateBookDto.publishedAt) {
      data.publishedAt = new Date(updateBookDto.publishedAt);
    }

    return this.prisma.book.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.book.delete({
      where: { id },
    });
  }
}

