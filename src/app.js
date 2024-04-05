const express = require('express');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
