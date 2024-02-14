import { Router } from "express";
import {register, login, logout, failRegister, loginWithGithub}from"../controllers/users.controller.js";
import passport from "passport";

const sessionRoutes = Router();

sessionRoutes.get('/failregister', failRegister);
sessionRoutes.post('/register', passport.authenticate('register',{failureRedirect:'failregister'}),register);
sessionRoutes.post('/login',passport.authenticate('login'),login);
sessionRoutes.post('/logout',logout);
sessionRoutes.get('/github',passport.authenticate('github',{scope:['user:email'] }));
sessionRoutes.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}));

export default sessionRoutes;
