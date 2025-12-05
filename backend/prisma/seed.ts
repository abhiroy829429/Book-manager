import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create authors
  const author1 = await prisma.author.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'J.K. Rowling',
      bio: 'British author, best known for the Harry Potter series.',
    },
  });

  const author2 = await prisma.author.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      name: 'George R.R. Martin',
      bio: 'American novelist and short story writer, known for A Song of Ice and Fire.',
    },
  });

  const author3 = await prisma.author.upsert({
    where: { id: '3' },
    update: {},
    create: {
      id: '3',
      name: 'J.R.R. Tolkien',
      bio: 'English writer and philologist, best known for The Hobbit and The Lord of the Rings.',
    },
  });

  // Create books
  const book1 = await prisma.book.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      title: 'Harry Potter and the Philosopher\'s Stone',
      isbn: '978-0747532699',
      publishedAt: new Date('1997-06-26'),
      authorId: author1.id,
    },
  });

  const book2 = await prisma.book.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      title: 'A Game of Thrones',
      isbn: '978-0553103540',
      publishedAt: new Date('1996-08-01'),
      authorId: author2.id,
    },
  });

  const book3 = await prisma.book.upsert({
    where: { id: '3' },
    update: {},
    create: {
      id: '3',
      title: 'The Hobbit',
      isbn: '978-0547928227',
      publishedAt: new Date('1937-09-21'),
      authorId: author3.id,
    },
  });

  

  console.log('Database seeded successfully!');
  console.log('Created:', { author1, author2, author3, book1, book2, book3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

