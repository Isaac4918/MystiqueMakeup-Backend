import { categoryDAOImpl } from "./CategoryDAOImpl";
import { Category } from "./Interfaces";
import { CategoryController } from "../../controllers/CategoryController";
import { ProductDAOImpl } from "./ProductDAOImpl";
import { promises as fs } from "fs";

let dao = ProductDAOImpl.getInstance();
let controller = CategoryController.getInstance();

const prueba = {
    "name": "PruebaCategory",
    "subCategories": [
        {
            "name": "PruebaSubCategory"
        },
        {
            "name": "PruebaSubCategory2"
        }
    ]
};

const pruebaUpdate = {
    "name": "PruebaCategory",
    "subCategories": [
        {
            "name": "Prueba1"
        },
        {
            "name": "Prueba2"
        },
        {
            "name": "Prueba3"
        }
    ]
};

// let testCategory: Category = {
//     name: "Test",
//     subCategories: [
//         {
//             name: "TestSubCategory"
//         },
//         {
//             name: "TestSubCategory2"
//         }
//     ]
// };

let testCategory2: Category = {
    name: "Test2",
    subCategories: [
        {
            name: "TestSubCategory"
        },
        {
            name: "TestSubCategory2"
        }
    ]
};

// dao.create(testCategory);
// dao.create(testCategory2);
async function test(){
    const buffer = await fs.readFile('C:/Users/Isaac/OneDrive/Imágenes/blackhole.jpg');
    const blob = new Blob([buffer], { type: "image/jpeg" });
   // dao.uploadImage(blob, "Products/1");
}

test();
