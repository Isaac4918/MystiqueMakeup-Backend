export interface CrudDAO{
    getAll(): Promise<Object[]>;
    get(pId:string): Promise<Object>;
    create(pObj:Object): Promise<boolean>;
    update(pObj:Object): Promise<boolean>;
    delete(pObj:Object): Promise<boolean>;
}
