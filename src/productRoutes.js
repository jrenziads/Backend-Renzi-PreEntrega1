const express = require('express');
const ProductManager = require('./ProductManager');

const router = express.Router();
const productManager = new ProductManager('productos.json');

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const minPrice = parseInt(req.query.minPrice);
        const maxPrice = parseInt(req.query.maxPrice);

        let products = await productManager.getProducts();

        if (!isNaN(limit)) {
            products = products.slice(0, limit);
        }

        if (!isNaN(minPrice)) {
            products = products.filter(product => product.price >= minPrice);
        }

        if (!isNaN(maxPrice)) {
            products = products.filter(product => product.price <= maxPrice);
        }

        res.json(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const product = await productManager.getProductById(productId);
        if (!product) {
            res.status(404).send("El producto no existe.");
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        await productManager.addProduct(req.body);
        res.status(201).send("Producto agregado correctamente.");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        await productManager.updateProduct(productId, req.body);
        res.send("Producto actualizado correctamente.");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        await productManager.deleteProduct(productId);
        res.send("Producto eliminado correctamente.");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
