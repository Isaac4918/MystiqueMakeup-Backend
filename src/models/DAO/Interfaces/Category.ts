const SubCategory = require('./SubCategory.ts');

interface Category {
    id: number;
    name: string;
    subCategories: typeof SubCategory[];
}

export default Category;
