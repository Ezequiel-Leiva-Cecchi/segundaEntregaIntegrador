import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { usersDAO } from "../dao/users/index.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { Strategy as GithubStrategy } from "passport-github2";
const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email } = req.body;
            try {
                const user = await usersDAO.getUserByEmail({ email: username });
                if (user) {
                    return done(null, false);
                }
                const hashedPassword = await createHash(password);
                const newUser = await usersDAO.addUsers({
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                });
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    )),
        passport.use('login', new LocalStrategy(
            { usernameField: 'email' },
            async (username, password, done) => {
                try {
                    const user = await usersDAO.getUserByEmail({ email: username });
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
        )),
        passport.use('github', new GithubStrategy(
            {
                clientID: 'Iv1.967e1f2adf04d46b',
                callbackURL: 'http://localhost:8080/api/session/githubcallback',
                clientSecret: '57fc8f2c426e76a4f73e2ab6ecdc082b68cd5f54'
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log('GitHub Profile:', profile);
                    const user = await usersDAO.getUserByEmail({ email: profile._json.email });
                    if (user) {
                        return done(null, user);
                    }
                    const newUser = await usersDAO.addUsers({
                        first_name: profile._json.name,
                        last_name: '',
                        email: profile._json.email || profile.username,
                        password: 'CreateWithGithub',
                    });
                    return done(null, newUser);
                } catch (error) {
                    return done(error);
                }
            }
        )),
        passport.serializeUser((user, done) => {
            done(null, user.id);
        }),
        passport.deserializeUser(async (id, done) => {
            const user = await usersDAO.getUserById(id);
            done(null, user);
        });
};
export default initializePassport;