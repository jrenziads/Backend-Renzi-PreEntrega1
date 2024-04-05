const fs = require('fs').promises;

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.cartIdCounter = 1;
        this.initializeCartFile();
        this.loadCarts();
    }

    async initializeCartFile() {
        try {
            const fileExists = await fs.access(this.path).then(() => true).catch(() => false);
            if (!fileExists) {
                await fs.writeFile(this.path, '[]');
                console.log("Archivo de carritos creado satisfactoriamente.");
            }
        } catch (err) {
            console.error("Error al inicializar el archivo de carritos:", err);
        }
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            if (data.trim() === "") {
                console.log("El archivo de carritos está vacío.");
                return;
            }
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.cartIdCounter = Math.max(...this.carts.map(cart => cart.id)) + 1;
            }
        } catch (err) {
            console.error("Error al cargar los carritos:", err);
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            console.log("Carritos guardados correctamente.");
        } catch (err) {
            console.error("Error al guardar los carritos:", err);
        }
    }

    async createCart() {
        try {
            const newCart = {
                id: this.cartIdCounter++,
                products: []
            };
            this.carts.push(newCart);
            await this.saveCarts();
            console.log('Carrito creado satisfactoriamente');
            return newCart;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(cartId) {
        await this.loadCarts();
        const cart = this.carts.find(cart => cart.id === cartId);
        if (cart) {
            return cart;
        } else {
            throw new Error("Carrito no encontrado.");
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await this.getCartById(cartId);
            const productIndex = cart.products.findIndex(product => product.productId === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
            await this.saveCarts();
            console.log("Producto agregado al carrito correctamente.");
        } catch (error) {
            throw error;
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            const productIndex = cart.products.findIndex(product => product.productId === productId);
            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                await this.saveCarts();
                console.log("Producto eliminado del carrito correctamente.");
            } else {
                throw new Error("Producto no encontrado en el carrito.");
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CartManager;
