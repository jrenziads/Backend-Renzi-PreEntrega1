const express = require('express');
const CartManager = require('./CartManager');

const router = express.Router();
const cartManager = new CartManager('carrito.json');

router.post('/', async (req, res) => {
    try {
        await cartManager.createCart();
        res.status(201).send("Carrito creado correctamente.");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    try {
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            res.status(404).send("El carrito no existe.");
        } else {
            res.json(cart); 
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity);
    try {
        if (isNaN(quantity) || quantity <= 0) {
            throw new Error("La cantidad del producto debe ser un número entero positivo.");
        }
        await cartManager.addProductToCart(cartId, productId, quantity);
        res.status(201).send("Producto agregado al carrito correctamente.");
    } catch (error) {
        res.status(500).send(error.message);
    }
});
router.get('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    try {
        const cart = await cartManager.getCartById(cartId);
        const product = cart.products.find(product => product.productId === productId);
        if (!product) {
            res.status(404).send("El producto no existe en el carrito.");
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
