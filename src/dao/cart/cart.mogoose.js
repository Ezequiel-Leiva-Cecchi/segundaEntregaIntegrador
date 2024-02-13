import cartModel from "../../models/carts.model.js";
import Cart from "../../models/carts.model.js";
import { productDAO } from "../product/index.js";

export class cartMongoose {
    async getCarts() {
        return await cartModel.find();
    }
    async getCartsById(id) {
        return await cartModel.findOne({ _id: id }).populate({ path: 'products.product', model: 'Product', option: { lean: { virtuals: true } }, });
    }
    async addProductCarts(cartId, productId) {
        const cart = await this.getCartsById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const product = await productDAO.getProductsById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        const existProductInCart = cart.products.findIndex((item) => item.product.id === productId);
        if (existProductInCart >= 0) {
            cart.products[existProductInCart].quantity++;
        } else {
            cart.products.push({ product: product._id, quantity: 1, });
        }
        await cart.save();
    }
    async deleteProductCart({ cartId, productId }) {
        let cart = await this.getCartsById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const existProductInCart = cart.products.findIndex((item) => item.product.id === productId);
        if (existProductInCart < 0) {
            throw new Error('Product is not in the cart');
        }
        cart.products = cart.products.filter((item) => item.product.id !== productId);
        await cart.save();
    }
    async deleteCart(id) {
        return await cartModel.findOneAndDelete({ _id: id });
    }
    async updateQuantityProduct(cartId, productId, updateQuantity) {
        let cart = await this.getCartsById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const product = await productDAO.getProductsById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        const existProductInCart = cart.products.findIndex((item) => item.product.id === productId);
        if (existProductInCart < 0) {
            throw new Error('Product is not in the cart');
        }
        cart.products[existingCartProductIndex].quantity =
            updateQuantity <= 0 ? 1 : updateQuantity;
        await cart.save();
    }
    async updateCart(cartId, updateProduct) {
        let cart = await this.getCartsById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const productsId = updateProduct.map((p) => p.product);
        let products = await productDAO.getProductsById(productsId);
        const unavailableProductIds = productsId.filter((productId) => !products.some((p) => p._id.toString() === productId));
        if (unavailableProductIds.length > 0) {
            throw new Error(`Product with id ${unavailableProductIds[0]} doesnt exist`);
        }
        cart.products = updateProduct;
        return await cart.save();
    }
}