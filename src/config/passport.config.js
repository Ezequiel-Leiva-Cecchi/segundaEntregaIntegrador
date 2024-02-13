import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { usersModel } from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { Strategy as GithubStrategy } from "passport-github2";
const localStrategy = LocalStrategy;

const initializePassport = () => {
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email } = req.body;
            try {
                const user = await usersModel.findOne({ email: username });
                if (user) {
                    return done(null, false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    password: createHash(password)
                };
                const result = await usersModel.create(newUser);
                return done(null, result);
            } catch (error) {
                console.error('Error getting user', error);
                return done(error);
            }
        }
    ));
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await usersModel.findOne({ email: username });
                if (!user) {
                    console.log('User doenst exists');
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        const user = await usersModel.findOne({ _id: id });
        done(null, user);
    });
    passport.use('github', new GithubStrategy(
        {
            clientID: 'Iv1.967e1f2adf04d46b',
            callbackURL: 'http://localhost:8080/api/session/githubcallback',
            clientSecret: '57fc8f2c426e76a4f73e2ab6ecdc082b68cd5f54'
        },
        async(accessToken,refreshToken,profile,done) =>{
            try {
                console.log('GitHub Profile:', profile._json);
                const user = await usersModel.findOne({email:profile._json.email});
                if(!user){
                    const newUser = {
                        first_name: profile._json.name ? profile._json.name.split(' ')[0] : '',
                        last_name: profile._json.name ? profile._json.name.split(' ')[1] : '',
                        email: profile._json.email,
                        password: 'Messigithub'
                    };
                    const result = await usersModel.create(newUser);
                    return done(null,result);
                }
                return done(null,user);
            } catch (error) {
                return done(error);
            }
        }
    ))
};

export default initializePassport;