import { Router } from "express";
import { usersModel } from "../models/users.model.js";
import passport from "passport";
const sessionRoutes = Router();

sessionRoutes.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    try {
        const result = await usersModel.create({
            first_name, last_name, email, password
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);

        // Verifica si es un error de índice único (código 11000) en el campo email
        if (error.code === 11000 && error.keyPattern && error.keyValue && error.keyPattern.email === 1) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        res.status(400).json({ error });
    }
});

sessionRoutes.get('/failregister', (req, res) => {
    res.status(400).send({ error: 'error to register' });
});

sessionRoutes.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await usersModel.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (user.email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            user.role = 'admin';
        } else {
            user.role = 'usuario';
        }
        req.session.user = user;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});

sessionRoutes.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.redirect('/login');
    });
});

sessionRoutes.post('/logout', (req, res) => {
    req.session.destroy((erro) => {
        if (erro) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ redirect: '/login' });
    });
});

sessionRoutes.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {});

sessionRoutes.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

export default sessionRoutes;
