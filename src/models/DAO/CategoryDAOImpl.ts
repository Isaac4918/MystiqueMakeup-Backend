import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './configurationDB/databaseConfig';
import { CrudDAO } from "./CrudDAO";
import { Category } from "./Interfaces";

export class categoryDAOImpl implements CrudDAO {
    private static instance: categoryDAOImpl;

    //Constructor
    private constructor() {
        //Default
    }

    //Getter
    public static getInstance(): categoryDAOImpl {
        if (!categoryDAOImpl.instance) {
            categoryDAOImpl.instance = new categoryDAOImpl();
        }
        return categoryDAOImpl.instance;
    }

    //Methods
    //--------------------------- CREATE ---------------------------------------------------------
    async create(pObj: Category): Promise<boolean> {
        try {
            console.log(pObj);
            await setDoc(doc(db, "Categories", pObj.name), pObj);
            console.log("Agregó con éxito");
            return true;
        } catch (error) {
            console.error("Error al escribir: ", error);
            return false;
        }
    }

    //--------------------------- GET ALL ---------------------------------------------------------
    async getAll(): Promise<Category[]> {
        let data: Category[] = [];
        try {
            const querySnapshot = await getDocs(collection(db, 'Categories'));

            querySnapshot.forEach((doc) => {
                // Add objects
                let categoryData = doc.data();
                let category: Category = { name: categoryData.name, subCategories: categoryData.subCategories };
                data.push(category);
            });
            //Return object array
            return data;

        } catch (error) {
            data = [];
            console.log("Error al obtener las categorías: ", error);
            return data;
        }
    }

    //--------------------------- GET ONE CATEGORY ---------------------------------------------------------
    async get(pId: string): Promise<Category> {
        try {
            const docSnapshot = await getDoc(doc(db, 'Categories', pId));

            if (docSnapshot.exists()) {
                // Get data
                let categoryData = docSnapshot.data();
                let category: Category = { name: categoryData.name, subCategories: categoryData.subCategories };

                // Return object
                return category;
            } else {
                throw new Error('No existe la categoría');
            }

        } catch (error) {
            throw new Error('Error al obtener la cateogoría: ' + error);
        }
    }

    //--------------------------- UPDATE ---------------------------------------------------------
    async update(pObj: Category): Promise<boolean> {
        try {
            const docRef = doc(db, 'Categories', pObj.name);
            await updateDoc(docRef, {
                name: pObj.name,
                subCategories: pObj.subCategories
            });
            console.log("Categoría actualizada con éxito");
            return true;
        } catch (error) {
            console.error("Error al actualizar la categoría: ", error);
            return false;
        }
    }

    //--------------------------- DELETE ---------------------------------------------------------
    async delete(name: string): Promise<boolean> {
        try {
            const docRef = doc(db, 'Categories', name);
            await deleteDoc(docRef);
            console.log("Categoría eliminada con éxito");
            return true;
        } catch (error) {
            console.error("Error al eliminar la categoría: ", error);
            return false;
        }
    }
}