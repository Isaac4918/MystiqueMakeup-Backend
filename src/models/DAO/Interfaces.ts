import { type } from "os";

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

export interface Agenda {
    title: string;
    start: string;
    duration: number;
    type: string;
    details: string;
    makeup: string;
    clientData: string;
}

export interface RequestedMakeups {
    orderNumber: number;
    username: string;
    makeup: string;
    requestedDate: string;
    scheduled: string;
}

export interface Observer {
    updateObserver(status: string): void;
}
  
export interface Subject {
    addObserver(username: string): void;
    removeObserver(observer: Observer): void;
    notifyObservers(): void;
}