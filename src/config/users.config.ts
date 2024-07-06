export const USER_CONFIG = {
  service: {
    error: {
      userCreation: 'Error al crear el paciente',
      userExistence: 'El paciente ya existe en la base de datos',
      userFound: 'paciente no encontrado',
      userFoundMany: 'Error al buscar pacientes',
      userInvalidId: 'ID de paciente inválido',
      userRemove: 'Error al eliminar el paciente',
      userUpdate: 'Error al actualizar el paciente',
    },
    success: {
      userCreation: 'paciente creado con éxito',
      userFound: 'paciente encontrado',
      userFoundMany: 'pacientes encontrados',
      userFoundManyEmpty: 'No hay pacientes en la base de datos',
      userRemove: 'paciente eliminado con éxito',
      userUpdate: 'paciente actualizado con éxito',
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
