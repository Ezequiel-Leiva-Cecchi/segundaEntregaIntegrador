import { cartDAO } from "../dao/cart/index.js"; 
import { productDAO } from "../dao/product/index.js";

export const renderIndexPage = async (req, res, next) => {
    try {
        const products = await productDAO.getProducts();
        res.render('index', {
            title: 'index',
            products: products,
            user: req.session.user
        });
    } catch (error) {
        console.error("Error rendering index page:", error);
        res.status(500).send("Internal Server Error");
    }
};
export const renderProductsPage = async ( req, res, next) =>{
    const { limit, sort, page, query } = req.query; 
        const Options = {
            limit: !limit ? 10 : limit, 
            sort: sort ? { price: sort } : undefined, 
            page: page ? page : 1, 
        };
        const products = await productDAO.getPaginatedProducts(query, Options);
        res.render('products',{
            title:'Products',
            products:products.payload,
            page:products.page,
            prevLink:products.prevLink,
            nextLink: products.nextLink
        });
};
export const renderProductPage = async(req, res, next) =>{
    const {productId} = req.params;
    const product = await productDAO.getProductById(productId);
    res.render('product',{
        title:'Product',
        product
    });
};
export const renderCartPage = async(req, res, next)=>{
    const {cartId} = req.params;
    const cart = await cartDAO.getCartById(cartId);
    res.render('cart',{title:'Cart',products:cart.product});
};
export const renderLoginPage = async (req, res, next) =>{
    res.render('login',{title:'Login'});
};
export const renderRegisterPage = async ( req, res, next) =>{
    res.render('register',{title:'Register'});
};