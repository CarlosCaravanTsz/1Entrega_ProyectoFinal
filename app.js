import express from 'express';
import productRouter from './src/routes/product.router.js'
import cartRouter from './src/routes/cart.router.js'
//import bodyParser from 'body-parser';

const app = express();
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)



app.listen(8080);