import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { usersDAO } from "../dao/users/index.js"; // Importa el DAO de usuarios
import { createHash, isValidPassword } from "../utils/bcrypt.js"; // Importa funciones de utilidad para el manejo de contraseñas
import { Strategy as GithubStrategy } from "passport-github2";

const localStrategy = LocalStrategy; // Alias para la estrategia local

// Función para inicializar Passport
const initializePassport = () => {
    // Estrategia para el registro de usuarios
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, // Opciones de configuración
        async (req, username, password, done) => { // Función de verificación de registro
            const { first_name, last_name, email } = req.body; // Obtiene los datos del cuerpo de la solicitud
            try {
                const user = await usersDAO.getUserByEmail({ email: username }); // Busca si ya existe un usuario con ese correo electrónico
                if (user) {
                    return done(null, false); // Si el usuario ya existe, devuelve falso
                }
                const hashedPassword = await createHash(password); // Genera un hash de la contraseña
                const newUser = await usersDAO.addUsers({ // Agrega el nuevo usuario a la base de datos
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
    ));

    // Estrategia para el inicio de sesión
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' }, // Opciones de configuración
        async (username, password, done) => { // Función de verificación de inicio de sesión
            try {
                const user = await usersDAO.getUserByEmail({ email: username }); // Busca el usuario por correo electrónico
                if (!user) {
                    console.log('User doesn\'t exist'); // Si el usuario no existe, imprime un mensaje de error
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

    // Estrategia para la autenticación con GitHub
    passport.use('github', new GithubStrategy(
        {
            clientID: 'Iv1.967e1f2adf04d46b',
            callbackURL: 'http://localhost:8080/api/session/githubcallback',
            clientSecret: '57fc8f2c426e76a4f73e2ab6ecdc082b68cd5f54'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log('GitHub Profile:', profile); // Imprime el perfil de GitHub
                const user = await usersDAO.getUserByEmail({ email: profile._json.email }); // Busca el usuario por correo electrónico
                if (user) {
                    return done(null, user); // Si el usuario ya existe, devuelve el usuario
                }
                const newUser = await usersDAO.addUsers({ // Agrega un nuevo usuario si no existe en la base de datos
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email || profile.username, // Usa el correo electrónico o el nombre de usuario como correo electrónico
                    password: 'CreateWithGithub', // Contraseña predeterminada para usuarios de GitHub
                });
                return done(null, newUser); 
            } catch (error) {
                return done(error); 
            }
        }
    ));

    // Serializa el usuario en la sesión
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserializa el usuario de la sesión
    passport.deserializeUser(async (id, done) => {
        const user = await usersDAO.getUserById(id); // Obtiene el usuario por ID
        done(null, user); // Devuelve el usuario
    });
};

export default initializePassport; 
