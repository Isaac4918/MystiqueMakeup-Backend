// imports
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { CategoryController } from '../controllers/CategoryController';
import { AccountController } from '../controllers/accountController';
import { ProductsController } from '../controllers/productsController';
import { PublicationsController } from '../controllers/publicationsController';
import { PurchaseController } from '../controllers/PurchaseController';


// controllers instances
const categoryController = CategoryController.getInstance();
const accountController = AccountController.getInstance();
const productsController = ProductsController.getInstance();
const publicationsController = PublicationsController.getInstance();
const purchaseController = PurchaseController.getInstance();

// multer configuration
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Create a new express app
const app = express();
// App configuration
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

// Define port number
const PORT = 5000;

// Define routes
// main route
app.get('/', (req, res) => {
    res.send('Welcome to the Mystique Makeup API!');
});

// ====================== IMAGES ======================
// upload publication image
app.post('/image/upload/:service/:id', upload.single('image'), async(req, res) => {
    const service = req.params.service;
    let pathBase = {
        "publications": "Publications/",
        "products": "Products/",
        "receipt": "Receipts/"
    }

    if(service != "products" && service != "publications" && service != "receipt"){
        return res.status(400).send('Invalid service');
    }
    else{
        if (!req.file) {
            res.status(400).send('No file uploaded.');
            console.log('No file uploaded.');
        }
        else{
            const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
            const url = await productsController.uploadImage(req.file.buffer, req.file.mimetype, pathBase[service] + req.params.id);
            console.log(url);
    
            const output = {
                imageUrl: url
            }
    
            res.status(200).json(output);
        }
    }
});

// delete publication image
app.delete('/image/delete', async(req, res) => {
    const path = req.body.path;
    let deleted = await productsController.deleteImage(path);
    if (deleted) {
        let deleteResponse= {"response":"Image deleted successfully"};
        res.status(200).json(deleteResponse);
    } else {
        let notDeleteResponse= {"response":"Image not deleted"};
        res.status(400).json(notDeleteResponse);
    }
});


// ====================== ACCOUNTS ======================
// new account
app.post('/createAccount', async(req, res) => {
    const data = req.body;
    await accountController.createAccount(data.username, data.password, data.email, data.admin);
    await purchaseController.createShoppingCart(data.username);
    const response = { 'response': 'Account created successfully' }
    res.json(response);
});

// update account
app.patch('/updateAccount', (req, res) => {
    const data = req.body;
    accountController.updateAccount(data.username, data.password, data.email, data.admin);
    res.status(200).send('Account updated successfully');
});

// delete account
app.delete('/deleteAccount', (req, res) => {
    const data = req.body;
    accountController.deleteAccount(data.username);
    purchaseController.deleteShoppingCart(data.username);
    res.status(200).send('Account removed successfully');
});

// get account
app.get('/getAccount', async (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send('No Authorization header');
        return;
    }

    const username = req.headers.authorization;
    const account = await accountController.getAccount(username);
    res.send({ account });
});


// login
app.post('/loginAccount', async (req, res) => {
    const data = req.body;
    const isValid = await accountController.verifyCredentials(data.username, data.password);
    if (isValid == true) {
        res.status(200).send(data.username);
    } else {
        res.status(401).send('Unauthorized');
    }
});

// search username
app.post('/getUsernames', async (req, res) => {
    const data = req.body;
    const usernameList = await accountController.getAllUsername(data.username);
    res.status(200).json(usernameList);
});


// ====================== CATEGORIES ======================

// get id
app.get('/category/get/id', async(req, res) => {
    let id = await categoryController.getId();
    res.status(200).json(id);
});

// update id
app.put('/category/update/id', async(req, res) => {
    const data = req.body.id;
    let updated = await categoryController.updateId(data);
    if (updated) {
        let updateResponse= {"response":"Id updated successfully"}
        res.status(200).json(updateResponse);
    } else {
        let notUpdateResponse= {"response":"Id not updated"}
        res.status(400).json(notUpdateResponse);
    }
});

// get all categories
app.get('/category/all', (req, res) => {
    categoryController.getAllCategories().then((data) => {
        console.log(data)
        res.json(data)
    })
});

// post a new category
app.post('/category/create', async(req, res) => {
    const data = req.body;
    let created = await categoryController.createCategory(data);
    if (created) {
        let createResponse= {"response":"Category created successfully"}
        res.status(200).json(createResponse);
    } else {
        let notCreateResponse= {"response":"Category not created"}
        res.status(400).json(notCreateResponse);
    }
});

// update a category
app.put('/category/update', async(req, res) => {
    const data = req.body;
    let updated = await categoryController.updateCategory(data);
    if (updated) {
        let updateResponse= {"response":"Category updated successfully"}
        res.status(200).json(updateResponse);
    } else {
        let notUpdateResponse= {"response":"Category not updated"}
        res.status(400).json(notUpdateResponse);
    }
});

// delete a category
app.delete('/category/delete', async(req, res) => {
    const data = req.body;
    let deleted = await categoryController.deleteCategory(data);
    if (deleted) {
        let deleteResponse= {"response":"Category deleted successfully"};
        res.status(200).json(deleteResponse);
    } else {
        let notDeleteResponse= {"response":"Category not deleted"};
        res.status(400).json(notDeleteResponse);
    }
});

// get a category
app.get('/category/get', async(req, res) => {
    const data = req.body.name;
    let category = await categoryController.getCategory(data);
    if (category) {
        res.status(200).json(category);
    } else {
        res.status(400).send('Category not found');
    }
});

// ====================== PRODUCTS ======================

// get id
app.get('/products/get/id', async(req, res) => {
    let id = await productsController.getId();
    res.status(200).json(id);
});

// update id
app.put('/products/update/id', async(req, res) => {
    const data = req.body.id;
    let updated = await productsController.updateId(data);
    if (updated) {
        let updateResponse= {"response":"Id updated successfully"}
        res.status(200).json(updateResponse);
    } else {
        let notUpdateResponse= {"response":"Id not updated"}
        res.status(400).json(notUpdateResponse);
    }
});

// create a new product
app.post('/products/create', async(req, res) => {
    const data = req.body;
    let created = await productsController.createProduct(data);
    if (created) {
        let createResponse= {"response":"Product created successfully"}
        res.status(200).json(createResponse);
    } else {
        let notCreateResponse= {"response":"Product not created"}
        res.status(400).json(notCreateResponse);
    }
});

// update a product
app.put('/products/update', async(req, res) => {
    const data = req.body;
    console.log(data);
    let updated = await productsController.updateProduct(data);
    if (updated) {
        let updateResponse= {"response":"Product updated successfully"}
        res.status(200).json(updateResponse);
    } else {
        let notUpdateResponse= {"response":"Product not updated"}
        res.status(400).json(notUpdateResponse);
    }
});

// get all products
app.get('/products/get/all', async(req, res) => {
    let products = await productsController.getAllProducts();
    if (products) {
        res.status(200).json(products);
    } else {
        res.status(400).send('Products not found');
    }
});

// get a product
app.get('/products/get/:id', async(req, res) => {
    const data = req.params.id.toString();
    let product = await productsController.getProduct(data);
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(400).send('Product not found');
    }
});

// delete a product
app.delete('/products/delete', async(req, res) => {
    const data = req.body.id.toString();
    let deleted = await productsController.deleteProduct(data);
    if (deleted) {
        let deleteResponse= {"response":"Product deleted successfully"};
        res.status(200).json(deleteResponse);
    } else {
        let notDeleteResponse= {"response":"Product not deleted"};
        res.status(400).json(notDeleteResponse);
    }
});

// get availability of a product
app.get('/products/get/availability', async(req, res) => {
    const id = req.body.id.toString();
    let availability = await productsController.getAvailability(id);
    if (availability) {
        res.status(200).json(availability);
    } else {
        let notFoundResponse= {"response":"Product not found"}
        res.status(400).json(notFoundResponse);
    }
});

// reduce availability of a product
app.put('/products/reduce/availability', async(req, res) => {
    const data = req.body;
    let updated = await productsController.reduceAvailability(data.id, data.quantity);
    if (updated) {
        let updateResponse= {"response":"Product availability updated successfully"}
        res.status(200).json(updateResponse);
    } else {
        let notUpdateResponse= {"response":"Product availability not updated"}
        res.status(400).json(notUpdateResponse);
    }
});

// ====================== PUBLICATIONS ======================

// get id
app.get('/publications/get/id', async(req, res) => {
    let id = await publicationsController.getId();
    res.status(200).json(id);
});

// update id
app.put('/publications/update/id', async(req, res) => {
    const data = req.body.id;
    let updated = await publicationsController.updateId(data);
    if (updated) {
        let updateResponse= {"response":"Id updated successfully"}
        res.status(200).json(updateResponse);
    } else {
        let notUpdateResponse= {"response":"Id not updated"}
        res.status(400).json(notUpdateResponse);
    }
});

// create a new publication
app.post('/publications/create', async(req, res) => {
    const data = req.body;
    let created = await publicationsController.createPublication(data);
    if (created) {
        let createResponse= {"response":"Publication created successfully"}
        res.status(200).json(createResponse);
    } else {
        let notCreateResponse= {"response":"Publication not created"}
        res.status(400).json(notCreateResponse);
    }
});

// update a publication
app.put('/publications/update', async(req, res) => {
    const data = req.body;
    console.log(data);
    let updated = await publicationsController.updatePublication(data);
    if (updated) {
        let updateResponse= {"response":"Publication updated successfully"}
        res.status(200).json(updateResponse);
    } else {
        let notUpdateResponse= {"response":"Publication not updated"}
        res.status(400).json(notUpdateResponse);
    }
});

// get all publications
app.get('/publications/get/all', async(req, res) => {
    let publications = await publicationsController.getAllPublications();
    if (publications) {
        res.status(200).json(publications);
    } else {
        let notFoundResponse= {"response":"Publications not found"}
        res.status(400).json(notFoundResponse);
    }
});

// get a publication
app.get('/publications/get/:id', async(req, res) => {
    const data = req.params.id.toString();
    let publication = await publicationsController.getPublication(data);
    if (publication) {
        res.status(200).json(publication);
    } else {
        let notFoundResponse= {"response":"Publication not found"}
        res.status(400).json(notFoundResponse);
    }
});

// delete a publication
app.delete('/publications/delete', async(req, res) => {
    const data = req.body.id.toString();
    let deleted = await publicationsController.deletePublication(data);
    if (deleted) {
        let deleteResponse= {"response":"Publication deleted successfully"};
        res.status(200).json(deleteResponse);
    } else {
        let notDeleteResponse= {"response":"Publication not deleted"};
        res.status(400).json(notDeleteResponse);
    }
});

// ====================== SHOPPING CART ======================
// get shopping cart
app.get('/shoppingCart/get', async(req, res) => {
    const data = req.body.username;
    let cart = await purchaseController.getShoppingCart(data);
    if (cart) {
        res.status(200).json(cart);
    } else {
        res.status(400).send('Shopping cart not found');
    }
});

// update shopping cart
app.put('/shoppingCart/update', async(req, res) => {
    const data = req.body;
    let updated = await purchaseController.updateShoppingCart(data);
    if (updated) {
        let updateResponse= {"response":"Shopping cart updated successfully"}
        res.status(200).json(updateResponse);
    } else {
        let notUpdateResponse= {"response":"Shopping cart not updated"}
        res.status(400).json(notUpdateResponse);
    }
});

// ====================== PURCHASES =========================

// get id
app.get('/purchases/get/id', async(req, res) => {
    let id = await purchaseController.getId();
    res.status(200).json(id);
});

// update id
app.put('/purchases/update/id', async(req, res) => {
    const data = req.body.id;
    let updated = await purchaseController.updateId(data);
    if (updated) {
        let updateResponse= {"response":"Id updated successfully"}
        res.status(200).json(updateResponse);
    } else {
        let notUpdateResponse= {"response":"Id not updated"}
        res.status(400).json(notUpdateResponse);
    }
});

// get all purchases
app.get('/purchases/get/all', async(req, res) => {
    let purchases = await purchaseController.getAllPurchases();
    if (purchases) {
        res.status(200).json(purchases);
    } else {
        res.status(400).send('Purchases not found');
    }
});

// get a purchase
app.get('/purchases/get', async(req, res) => {
    const data = req.body.orderNumber.toString();
    let purchase = await purchaseController.getPurchase(data);
    if (purchase) {
        res.status(200).json(purchase);
    } else {
        res.status(400).send('Purchase not found');
    }
});

// create a new purchase
app.post('/purchases/create', async(req, res) => {
    const data = req.body;
    let created = await purchaseController.createPurchase(data);
    if (created) {
        let createResponse= {"response":"Purchase created successfully"}
        res.status(200).json(createResponse);
    } else {
        let notCreateResponse= {"response":"Purchase not created"}
        res.status(400).json(notCreateResponse);
    }
});

// update a purchase
app.put('/purchases/update', async(req, res) => {
    const data = req.body;
    let updated = await purchaseController.updatePurchase(data);
    if (updated) {
        let updateResponse= {"response":"Purchase updated successfully"}
        res.status(200).json(updateResponse);
    } else {
        let notUpdateResponse= {"response":"Purchase not updated"}
        res.status(400).json(notUpdateResponse);
    }
});

// delete a purchase
app.delete('/purchases/delete', async(req, res) => {
    const data = req.body.orderNumber.toString();
    let deleted = await purchaseController.deletePurchase(data);
    if (deleted) {
        let deleteResponse= {"response":"Purchase deleted successfully"};
        res.status(200).json(deleteResponse);
    } else {
        let notDeleteResponse= {"response":"Purchase not deleted"};
        res.status(400).json(notDeleteResponse);
    }
});

// ====================== GENERAL USES ======================
// handling 404 errors
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});


/*
const fetchData = async(user, contra) => {
        const newData = await fetch('http://localhost:5000/inicio',{
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                {"subcategory": ["Subprueba1", "Subprueba2"], "name": "PruebaAPI" }
            })
        }).then(res => res.json())
        if(newData.outResult == 0){
            console.log(true)
            navigate("/home")
        }else{
            console.log(false)
            setPasswordError(true);
        }
        
    }
*/