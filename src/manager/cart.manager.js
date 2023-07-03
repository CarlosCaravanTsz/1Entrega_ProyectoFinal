import FileManager from './file.manager.js';
import fs from 'fs';

export default class CartManager extends FileManager {

    constructor() {
        super('../PrimerEntregableFinal/src/db/carts.json');
    };

    create = async () => {
        const data = {
            products: [],
        };
        return await this.set(data);
    };

    getCarts = async () => {
        let carts = fs.existsSync(this.path) ? JSON.parse(await fs.promises.readFile(this.path, { encoding: this.format })) : [];
        return carts;
    }

    set = async (cart) => {

        try {
            const elements = await this.getCarts();

            cart.id = await this.getNextId(elements);
            elements.push(cart);
            fs.promises.writeFile(this.path, JSON.stringify(elements));
            return {status: 'Producto Agregado Exitosamente'}
        } catch {
            return {status: 'ERROR al escribir el archivo'}
        }
    };


    list = async (cid) => {
        const carts_list = await this.getCarts();
        const c_cart = carts_list.find(p => p.id === cid);
        return c_cart? c_cart : {status: 'Error al consultar Carrito'}
    };


    addProduct = async (cid, pid) => { // TODO: VALIDATE IF PID IS A VALID PRODUCT ID


        const cart = await this.list(cid);
        const id = cart.products.findIndex(p => p.id === pid);
        if (id < 0) {
            cart.products.push({ id: pid, quantity: 1 });
        } else {
            cart.products[id].quantity += 1;
        }
        return await this.updateCart(cid, cart);
    };


    updateCart = async (cid, newCart) => {
        try {
            const carts = await this.getCarts();
            const id = carts.findIndex(p => p.id === cid)
            carts[id] = newCart;
            fs.promises.writeFile(this.path, JSON.stringify(carts));
            return carts;
        } catch {
            return {status: 'ERROR al actualizar carrito'}
        }
    };


    deleteProduct = async (cid, pid) => {
        const cart = await this.list(cid);

        const id = cart.products.findIndex(p => p.id === pid);
        if (id < 0) {
            return {status: 'ERROR: No existen productos con ese ID en tu carrito'}
        } else if (cart.products[id].quantity == 1) {
            cart.products.splice(id, 1); // 2nd parameter means remove one item only
        }else {
            cart.products[id].quantity -= 1;
        }

        return await this.updateCart(cid, cart);

    };
        ;
}