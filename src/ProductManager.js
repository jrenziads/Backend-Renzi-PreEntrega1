const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.productIdCounter = 1;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const fileExists = await fs.access(this.path).then(() => true).catch(() => false);
            if (!fileExists) {
                console.log("El archivo de productos no existe. Se creará uno nuevo.");
                return;
            }

            const data = await fs.readFile(this.path, 'utf8');
            if (data.trim() === "") {
                console.log("El archivo de productos está vacío.");
                return;
            }
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                this.productIdCounter = Math.max(...this.products.map(product => product.id)) + 1;
            }
        } catch (err) {
            console.error("Error al cargar los productos:", err);
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
            console.log("Productos guardados correctamente.");
        } catch (err) {
            console.error("Error al guardar los productos:", err);
        }
    }

    async addProduct(product) {
        try {
            await this.loadProducts();

            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                throw new Error("Todos los campos son obligatorios.");
            }

            if (this.products.some(existingProduct => existingProduct.code === product.code)) {
                throw new Error("Ya existe un producto con el mismo código.");
            }

            product.id = this.productIdCounter++;
            this.products.push(product);
            await this.saveProducts();
            console.log('Producto agregado satisfactoriamente');
        } catch (error) {
            throw error;
        }
    }

    async getProducts() {
        await this.loadProducts();
        return this.products;
    }

    async getProductById(id) {
        await this.loadProducts();
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            throw new Error("Producto no encontrado.");
        }
    }

    async updateProduct(id, updatedProduct) {
        await this.loadProducts();
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...updatedProduct, id };
            await this.saveProducts();
            console.log("Producto actualizado correctamente.");
        } else {
            throw new Error("Producto no encontrado.");
        }
    }

    async deleteProduct(id) {
        await this.loadProducts();
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            await this.saveProducts();
            console.log("Producto eliminado correctamente.");
        } else {
            throw new Error("Producto no encontrado.");
        }
    }
}

module.exports = ProductManager;
