import { PrismaClient } from '@prisma/client';
import { categoryList } from '../../src/constants';

export default async function handler(req, res) {
  try {
    const prisma = new PrismaClient();
    const categories = categoryList.reduce((acc, category) => {
      return [...acc, { name: category, slug: `/${category}` }];
    }, []);

    const test = await prisma.category.createMany({
      data: categories,
    });

    console.log(test);

    res.json({
      test,
    });
  } catch (err) {
    console.log(err);
  }
}
