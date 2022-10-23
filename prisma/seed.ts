// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const SALT = 10;

  for (let i = 0; i < 500; i += 1) {
    const email = faker.internet.email();
    const name = faker.name.fullName();
    const role = Number(faker.datatype.boolean());
    const password = await bcrypt.hash(faker.internet.password(), SALT);

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
        role,
        password,
      },
    });

    console.log(user);

    const randomNumber = +faker.random.numeric(1);

    for (let j = 0; j < randomNumber; j += 1) {
      const published = faker.datatype.boolean();
      const title = faker.random.words(3);
      const description = faker.random.words(10);

      const post = await prisma.post.create({
        data: {
          title,
          published,
          description,
          updatedAt: new Date(),
          authorId: user.id,
        },
      });

      console.log(post);
    }
  }
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
