export const USER_CONFIG = {
  service: {
    error: {
      userCreation: 'Error al crear el usuario',
      userExistence: 'El usuario ya existe en la base de datos',
      userFound: 'Usuario no encontrado',
      userFoundMany: 'Error al buscar usuarios',
      userInvalidId: 'ID de usuario inválido',
      userRemove: 'Error al eliminar el usuario',
      userUpdate: 'Error al actualizar el usuario',
    },
    success: {
      userCreation: 'Usuario creado con éxito',
      userFound: 'Usuario encontrado',
      userFoundMany: 'Usuarios encontrados',
      userFoundManyEmpty: 'No hay usuarios en la base de datos',
      userRemove: 'Usuario eliminado con éxito',
      userUpdate: 'Usuario actualizado con éxito',
    },
  },
  validation: {
    firstName: {
      message: 'El nombre debe ser una cadena de texto.',
      min: 'El nombre debe poseer al menos 3 caracteres.',
      max: 'El nombre no debe superar los 30 caracteres.',
    },
    lastName: {
      message: 'El apellido debe ser una cadena de texto.',
      min: 'El apellido debe poseer al menos 3 caracteres.',
      max: 'El apellido no debe superar los 30 caracteres.',
    },
    dni: {
      message: 'El DNI debe ser un número entero.',
      min: 'El DNI debe poseer al menos 7 dígitos.',
      max: 'El DNI no debe superar los 8 dígitos.',
    },
    phone: {
      message: 'El teléfono debe ser un número entero.',
      min: 'El teléfono debe poseer al menos 10 dígitos.',
      max: 'El teléfono no debe superar los 10 dígitos.',
    },
    email: {
      message: 'El email debe ser una cadena de texto con formato de email.',
    },
  },
};
