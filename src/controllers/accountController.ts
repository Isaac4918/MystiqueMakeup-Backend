const Account = require("../models/Account.ts");
const AccountDAOImpl = require("../models/DAO/AccountDAOImpl.ts");
const Notification = require("../models/DAO/Interfaces/Notification.ts");

class AccountController{
    private static instance: AccountController;
    private accountDAO: typeof AccountDAOImpl;

    //Constructor
    constructor(){
        this.accountDAO = AccountDAOImpl.getInstanceAccount(); 
    }
    
    //Getter
    public static getInstance(): AccountController {
        if (!AccountController.instance) {
            AccountController.instance = new AccountController();
        }
        return AccountController.instance;
    }

    //Methods

    //---------------------------------------------------- REGISTER ---------------------------------------------------------
    
    //--------------------------- CREATE ---------------------------------------------------------
    async createAccount(username: string, password: string, email: string, admin: boolean): Promise<void>{
        if(this.validateEmpty(username, password, email, admin)){
            console.log("Debe llenar todos los campos");
        }else{
            let uniqueUsername = await this.validateUniqueUsername(username);
            if(uniqueUsername){
                if(this.validatePassword(password)){
                    if(this.validateEmail(email)){
                        let account = new Account(username, password, email, admin);
                        this.accountDAO.create(account);
                    }else{
                        console.log("Ingrese un correo válido");
                    }
                }else{
                    console.log("Ingrese una contraseña minimo de 8 digitos con al menos una letra, número y caracter especial");
                }
            }else{
                console.log("El nombre de usuario ya existe");
            }
        }
    }

    //---------------------------------------------------- MANAGER ACCOUNT ---------------------------------------------------------

    //--------------------------- UPDATE ---------------------------------------------------------
    async updateAccount(username: string, password: string, email: string, admin: boolean): Promise<void>{
        if(this.validateEmpty(username, password, email, admin)){
            console.log("Debe llenar todos los campos");
        }else{
            if(this.validatePassword(password)){
                if(this.validateEmail(email)){
                    let account = await this.accountDAO.get(username);
                    if(account != null){
                        if(account.getPassword() != password){
                            account.setPassword(password);
                        }
            
                        if(account.getEmail() != email){
                            account.setEmail(email);
                        }
            
                        if(account.getAdmin() != admin){
                            account.setAdmin(admin);
                        }
                        
                        this.accountDAO.update(account);
                    }
                }else{
                    console.log("Ingrese un correo válido");
                }
            }else{
                console.log("Ingrese una contraseña minimo de 8 digitos con al menos una letra, número y caracter especial");
            }

        }
    }
    
    //--------------------------- DELETE ---------------------------------------------------------
    async deleteAccount(username: string): Promise<void>{
        if(username != ""){
            let uniqueUsername = await this.validateUniqueUsername(username);
            if(uniqueUsername == false){
                let account = await this.accountDAO.get(username);
                if(account != null){
                    this.accountDAO.delete(account);
                }
            }
        }else{
            console.log("Debe ingresar un nombre de usuario");
        }
    }

    //--------------------------- GET ---------------------------------------------------------
    async getAccount(username: string): Promise<typeof Account | null>{
        let account = await this.accountDAO.get(username);
        if(account != null){
            return account;
        }
        return null;
    }

    async getAllUsername(username: string): Promise<string[]>{
        let usernameList: string[] = [];
        let usernameDAO = '';
        
        for(let account of await this.accountDAO.getAll()){
            if(account.getUsername().includes(username) && account.getAdmin() == false){
                usernameDAO = account.getUsername();
                usernameList.push(usernameDAO);
            }
        }
        return usernameList;
    }

    async getAllUsers(): Promise<string[]>{
        let accountList: string[] = [];
        for(let account of await this.accountDAO.getAll()){
            if(account.getAdmin() == false){
                accountList.push(account.getUsername());
            }
        }
        return accountList;
    }


    //-------------------------------------------------------------------------------------------------------------------------------------

    //---------------------------  LOGIN  ---------------------------------------------------------
    async verifyCredentials(username: string, password: string): Promise<boolean>{
        let account = await this.accountDAO.get(username);
        if(account != null){
            if(account.getUsername() == username && account.getPassword() == password){
                return true;
            }
        }
        return false;
    }

    //----------------------------- VALIDATIONS ---------------------------------------------------------
    private validateEmpty(username: string, password: string, email: string, admin: boolean): boolean{
        if(username == "" || password == "" || email == "" || admin == null){
            return true;
        }
        return false;
    }

    private async validateUniqueUsername(username: string): Promise<boolean>{
        for(let account of await this.accountDAO.getAll()){
            if(account.getUsername() == username){
                return false;
            }
        }
        return true;
    }

    private validatePassword(password: string): boolean{
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/;
        if(password.length >= 8 && regex.test(password)){
            return true;
        }
        return false;
    }

    private validateEmail(email: string): boolean{
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    //-------------------------------------------------------------------------------------------------------------------------------------
    
    //---------------------------------- NOTIFICATIONS -----------------------------------------
    async getAllNotifications(username: string): Promise<Notification[]>{
        return await this.accountDAO.getNotify(username);
    }

    async updateNotification(pNotification: Notification): Promise<boolean>{
        return await this.accountDAO.updateNotify(pNotification);
    }
}

export default AccountController;