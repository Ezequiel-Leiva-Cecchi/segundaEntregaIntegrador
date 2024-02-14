import { userDAO } from '../dao/user/index.js';

// Función para registrar un nuevo usuario
export const register = async (req, res, next) => {
  try {
    // Se intenta agregar un nuevo usuario utilizando los datos del cuerpo de la solicitud
    const user = await userDAO.addUser(req.body);

    // Se verifica si el usuario registrado es el administrador predeterminado
    if (
      user.email === 'adminCoder@coder.com' &&
      user.password === 'adminCod3r123'
    ) {
      user.isAdmin = true; // Si lo es, se le otorga el estado de administrador
    } else {
      user.isAdmin = false;
    }

    // Se almacena la información del usuario en la sesión
    req.session.user = user;

    // Redirigir al usuario a la página principal después del registro
    res.redirect('/');
  } catch (err) {
    console.error(err);
    // Si hay un error durante el registro, se devuelve un mensaje de error JSON
    res.status(400).json({ error: err.message });
  }
};

// Función para iniciar sesión
export const login = async (req, res, next) => {
  try {
    // Se obtienen el correo electrónico y la contraseña del cuerpo de la solicitud
    const { email, password } = req.body;

    // Se intenta obtener los detalles del usuario basados en el correo electrónico
    const user = await userDAO.getUserByEmail({ email });

    // Se verifica si se encontró un usuario y si la contraseña coincide
    if (!user) throw new Error('User not found');
    if (user.password !== password) throw new Error('Credentials do not match');

    // Se verifica si el usuario es el administrador predeterminado
    if (
      user.email === 'adminCoder@coder.com' &&
      user.password === 'adminCod3r123'
    ) {
      user.isAdmin = true; // Si lo es, se le otorga el estado de administrador
    } else {
      user.isAdmin = false;
    }

    // Se almacena la información del usuario en la sesión
    req.session.user = user;

    // Redirigir al usuario a la página principal después del inicio de sesión
    res.redirect('/');
  } catch (err) {
    console.error(err);
    // Si hay un error durante el inicio de sesión, se devuelve un mensaje de error JSON
    res.status(400).json({ error: err.message });
  }
};

// Función para cerrar sesión
export const logout = async (req, res, next) => {
  try {
    // Se destruye la sesión del usuario actual
    await req.session.destroy();

    // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    // Si hay un error durante el cierre de sesión, se devuelve un mensaje de error JSON
    res.status(400).json({ error: err.message });
  }
};

// Función para manejar el caso en el que falla el registro
export const registerFail = async (req, res, next) => {
  // Se devuelve un mensaje de error JSON indicando que el registro ha fallado
  res.status(400).send({ error: 'Failed to register' });
};

// Función para iniciar sesión con GitHub
export const loginWithGithub = async (req, res, next) => {
  // Se almacena la información del usuario autenticado a través de GitHub en la sesión
  req.session.user = req.user;
  // Redirigir al usuario a la página principal después del inicio de sesión
  res.redirect('/');
};
