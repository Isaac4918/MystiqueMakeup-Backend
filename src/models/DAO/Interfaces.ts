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
    image: string;
    category: string;
    subCategory: string;
    price: number;
    available: number;
}

export interface Publication {
    id: number
    name: string;
    description: string;
    image: string;
    category: string;
    subCategory: string;
    date: string;
    tags: string[];
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
