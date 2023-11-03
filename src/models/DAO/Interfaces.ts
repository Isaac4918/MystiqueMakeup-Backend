/*
Definition of the json structures to be used in the API, DAO and controllers
*/
export interface Account {
    username: string;
    password: string;
    email: string;
    admin: boolean;
}

export interface SubCategory {
    name: string;
}

export interface Category {
    name: string;
    subCategories: SubCategory[];
}


export interface Product {
    id: number
    name: string;
    description: string;
    imagePath: string;
    category: string;
    subCategory: string;
    price: number;
    available: number;
    imageURL: string;
}

export interface Publication {
    id: number
    name: string;
    description: string;
    imagePath: string;
    category: string;
    subCategory: string;
    date: string;
    tags: string[];
    imageURL: string;
}

export interface ShoppingCart {
    username: string;
    products: Product[];
}

export interface Purchase {
    orderNumber: number;
    address: string;
    receiptImageName: string;
    finalPrice: number;
    cart: ShoppingCart;
}
