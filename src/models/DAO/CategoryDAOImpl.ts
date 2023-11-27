import { CrudDAO } from "./CrudDAO";
const firestore = require('firebase/firestore');
const { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where } = firestore;
const db = require('./configurationDB/databaseConfig.ts');
const Category = require('./Interfaces/Category.ts');
const PublicationDAOImpl = require('./publicationDAOImpl.ts');
const Publication = require('./Interfaces/Publication.ts');

class categoryDAOImpl implements CrudDAO {
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

    async getId(): Promise<number> {
        try {
            const querySnapshot = await getDocs(collection(db, 'Identificators'));
            let currentId = 0;
  
            querySnapshot.forEach((doc) => {
                if(doc.id == "CategoryID"){
                    currentId = doc.data().Id;
                }
            });
            //Return object array
            return currentId;
          } catch (error) {
            throw new Error('Por el momento, no existen productos');
          }
    }

    async updateId(pId: number): Promise<boolean> {
        try {
            console.log(pId);
            const docRef = doc(db, 'Identificators', 'CategoryID');
            await updateDoc(docRef, {
                Id: pId
            });
            return true;

          } catch (error) {
            return false;
          }
    }

    //--------------------------- CREATE ---------------------------------------------------------
    async create(pObj: typeof Category): Promise<boolean> {
        try {
            await setDoc(doc(db, "Categories", pObj.id.toString()), pObj);
            console.log("Agregó con éxito");
            return true;
        } catch (error) {
            console.error("Error al escribir: ", error);
            return false;
        }
    }

    //--------------------------- GET ALL ---------------------------------------------------------
    async getAll(): Promise<typeof Category[]> {
        let data: typeof Category[] = [];
        try {
            const querySnapshot = await getDocs(collection(db, 'Categories'));

            querySnapshot.forEach((doc) => {
                // Add objects
                let categoryData = doc.data();
                let category: typeof Category = { id: categoryData.id, name: categoryData.name, subCategories: categoryData.subCategories };
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
    async get(pId: string): Promise<typeof Category> {
        try {
            const docSnapshot = await getDoc(doc(db, 'Categories', pId));

            if (docSnapshot.exists()) {
                // Get data
                let categoryData = docSnapshot.data();
                let category: typeof Category = { id: categoryData.id, name: categoryData.name, subCategories: categoryData.subCategories };

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
    async update(pObj: typeof Category): Promise<boolean> {
        try {
            const data = pObj.name;
            const [newName, oldName] = data.split(',');

            // Update category name and subcategories in 'Publications'
            let publications: typeof Publication[] = [];
            publications = await PublicationDAOImpl.getInstancePublication().getAll();

            for (let publication of publications) {
                if (publication.category == oldName) {
                    const docRef = doc(db, 'Publications', publication.id.toString());
                    await updateDoc(docRef, {
                        category: newName,
                        subCategories: pObj.subCategories
                    });
                }
            }

            const docRef = doc(db, 'Categories', pObj.id.toString());
            await updateDoc(docRef, {
                name: newName,
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
    async delete(pCategory: typeof Category): Promise<boolean> {
        try {
            const collectionRefPublication = collection(db, 'Publications');
            const querySnapshotPublication = await getDocs(collectionRefPublication);
            const collectionRefProduct = collection(db, 'Products');
            const querySnapshotProduct = await getDocs(collectionRefProduct);

            for (const doc of querySnapshotPublication.docs) {
                const data = doc.data(); 
                if (data && data.category == pCategory.name) {
                    console.log("La categoría no se puede eliminar porque está siendo utilizada por una publicación.");
                    return false;
                }
            }

            for (const doc of querySnapshotProduct.docs) {
                const data = doc.data();
                if (data && data.category == pCategory.name) {
                    console.log("La categoría no se puede eliminar porque está siendo utilizada por un producto.");
                    return false;
                }
            }

            const docRef = doc(db, 'Categories', pCategory.id.toString());
            await deleteDoc(docRef);
            console.log("Categoría eliminada con éxito");
            return true;
        } catch (error) {
            console.error("Error al eliminar la categoría: ", error);
            return false;
        }
    }
}

export default categoryDAOImpl;