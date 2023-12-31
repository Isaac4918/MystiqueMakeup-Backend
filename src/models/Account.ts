import { Observer, Purchase } from "./DAO/Interfaces";
import { AccountDAOImpl } from "./DAO/AccountDAOImpl";


export class Account implements Observer{
    private username: string;
    private password: string;
    private email: string;
    private admin: boolean;


    //Constructor
    constructor(username: string, password: string, email: string, admin: boolean){
        this.username = username;
        this.password = password;
        this.email = email;
        this.admin = admin;
    }

    //Getters and setters
    public getUsername(): string{
        return this.username;
    }

    public getPassword(): string{
        return this.password;
    }

    public setPassword(password: string): void{
        this.password = password;
    }

    public getEmail(): string{
        return this.email;
    }

    public setEmail(email: string): void{
        this.email = email;
    }

    public getAdmin(): boolean{
        return this.admin;
    }

    public setAdmin(admin: boolean): void{
        this.admin = admin;
    }

    //------------------ OBSERVER --------------------------
    updateObserver(pPurchase: Purchase): void {
        var status = pPurchase.scheduled;
        var orderNumber = pPurchase.orderNumber;
        var deliveryDate = pPurchase.deliveryDate;

        AccountDAOImpl.getInstanceAccount().createNotify(this, orderNumber, status, deliveryDate);
    }

}