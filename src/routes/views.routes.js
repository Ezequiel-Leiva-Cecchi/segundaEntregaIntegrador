import { Router } from "express";
import { checkExistingUser } from "../middlewares/authMiddleware.js";

const viewsRoutes = Router();

viewsRoutes.get('/', (req, res) => {
    const user = req.session.user;
    res.render('index', { user });
});

viewsRoutes.get('/login', checkExistingUser, (req, res) => {
    res.render('login');
});

viewsRoutes.get('/register', checkExistingUser, (req, res) => {
    res.render('register');
});

export default viewsRoutes;
