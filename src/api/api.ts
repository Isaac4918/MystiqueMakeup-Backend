// imports
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { CategoryController } from '../controllers/CategoryController';
import { AccountController } from '../controllers/accountController';
import { ProductsController } from '../controllers/productsController';
import { PublicationsController } from '../controllers/publicationsController';


// controllers instances
const categoryController = CategoryController.getInstance();
const accountController = AccountController.getInstance();
const productsController = ProductsController.getInstance();
const publicationsController = PublicationsController.getInstance();

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

// ====================== ACCOUNTS ======================
// new account
app.post('/createAccount', (req, res) => {
    const data = req.body;
    accountController.createAccount(data.username, data.password, data.email, data.admin);
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
        res.status(200).send('Category created successfully');
    } else {
        res.status(400).send('Category not created');
    }
});

// update a category
app.put('/category/update', async(req, res) => {
    const data = req.body;
    let updated = await categoryController.updateCategory(data);
    if (updated) {
        res.status(200).send('Category updated successfully');
    } else {
        res.status(400).send('Category not updated');
    }
});

// delete a category
app.delete('/category/delete', async(req, res) => {
    const data = req.body.name;
    let deleted = await categoryController.deleteCategory(data);
    if (deleted) {
        res.status(200).send('Category deleted successfully');
    } else {
        res.status(400).send('Category not deleted');
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

// upload a product image
app.post('/products/image/upload/:id', upload.single('image'), async(req, res) => {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        console.log('No file uploaded.');
    }
    else{
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
        const url = await productsController.uploadImage(req.file.buffer, req.file.mimetype, "Products/"+ req.params.id);
        console.log(url);

        const output = {
            imageUrl: url
        }

        res.status(200).json(output);
    }
});

// delete a product image
app.delete('/products/image/delete', async(req, res) => {
    const path = req.body.path;
    let deleted = await productsController.deleteImage(path);
    if (deleted) {
        res.status(200).send('Image deleted successfully');
    } else {
        res.status(400).send('Image not deleted');
    }
});

// create a new product
app.post('/products/create', async(req, res) => {
    const data = req.body;
    let created = await productsController.createProduct(data);
    if (created) {
        res.status(200).send('Product created successfully');
    } else {
        res.status(400).send('Product not created');
    }
});

// update a product
app.put('/products/update', async(req, res) => {
    const data = req.body;
    let updated = await productsController.updateProduct(data);
    if (updated) {
        res.status(200).send('Product updated successfully');
    } else {
        res.status(400).send('Product not updated');
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
app.get('/products/get', async(req, res) => {
    const data = req.body.id.toString();
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
        res.status(200).send('Product deleted successfully');
    } else {
        res.status(400).send('Product not deleted');
    }
});

// ====================== PUBLICATIONS ======================

// upload publication image
app.post('/publications/image/upload/:id', upload.single('image'), async(req, res) => {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        console.log('No file uploaded.');
    }
    else{
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
        const url = await productsController.uploadImage(req.file.buffer, req.file.mimetype, "Publications/"+ req.params.id);
        console.log(url);

        const output = {
            imageUrl: url
        }

        res.status(200).json(output);
    }
});

// delete publication image
app.delete('/publications/image/delete', async(req, res) => {
    const path = req.body.path;
    let deleted = await productsController.deleteImage(path);
    if (deleted) {
        res.status(200).send('Image deleted successfully');
    } else {
        res.status(400).send('Image not deleted');
    }
});

// create a new publication
app.post('/publications/create', async(req, res) => {
    const data = req.body;
    let created = await publicationsController.createPublication(data);
    if (created) {
        res.status(200).send('Publication created successfully');
    } else {
        res.status(400).send('Publication not created');
    }
});

// update a publication
app.put('/publications/update', async(req, res) => {
    const data = req.body;
    let updated = await publicationsController.updatePublication(data);
    if (updated) {
        res.status(200).send('Publication updated successfully');
    } else {
        res.status(400).send('Publication not updated');
    }
});

// get all publications
app.get('/publications/get/all', async(req, res) => {
    let publications = await publicationsController.getAllPublications();
    if (publications) {
        res.status(200).json(publications);
    } else {
        res.status(400).send('Publications not found');
    }
});

// get a publication
app.get('/publications/get', async(req, res) => {
    const data = req.body.id.toString();
    let publication = await publicationsController.getPublication(data);
    if (publication) {
        res.status(200).json(publication);
    } else {
        res.status(400).send('Publication not found');
    }
});

// delete a publication
app.delete('/publications/delete', async(req, res) => {
    const data = req.body.id.toString();
    let deleted = await publicationsController.deletePublication(data);
    if (deleted) {
        res.status(200).send('Publication deleted successfully');
    } else {
        res.status(400).send('Publication not deleted');
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