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

    let randomNumber = +faker.random.numeric(1);

    for (let j = 0; j < randomNumber; j += 1) {
      const published = faker.datatype.boolean();
      const title = faker.random.words(3);

      const post = await prisma.post.create({
        data: {
          title,
          published,
          authorId: user.id,
        },
      });

      console.log(post);
    }

    randomNumber = +faker.random.numeric(1);

    for (let j = 0; j < randomNumber; j += 1) {
      const title = faker.random.words(3);
      const description = faker.random.words(3);
      const body = faker.random.words(3);
      const published = faker.datatype.boolean();

      const article = await prisma.article.upsert({
        where: { title },
        update: {},
        create: {
          title,
          description,
          body,
          published,
        },
      });

      console.log(article);
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
