export interface CrudDAO{
    getAll(): Promise<Object[]>;
    get(pId:string): Promise<Object | null>;
    create(pObj:Object): Promise<boolean | string>;
    update(pObj:Object): Promise<boolean>;
    delete(pObj:Object): Promise<boolean>;
}

//export default CrudDAO;
