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
    id: number;
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

export interface ProductAddedToCart {
    id: number;
    quantity: number;
    price: number;
}

export interface ShoppingCart {
    username: string;
    products: ProductAddedToCart[];
}

export interface Purchase {
    orderNumber: number;
    username: string;
    address: string;
    receiptImagePath: string;
    receiptImageURL: string;
    partialPrice: number;
    finalPrice: number;
    scheduled: boolean;
    paymentDate: string;
    deliveryDate: string;
    cart: ShoppingCart;
    details: string; 
}

// Interfaz para el Observador
export interface Observer {
    update(message: string): void;
  }
  
  // Interfaz para el Sujeto
export interface Subject {
    addObserver(observer: Observer): void;
    removeObserver(observer: Observer): void;
    notifyObservers(message: string): void;
}