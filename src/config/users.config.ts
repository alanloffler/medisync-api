export const USERS_CONFIG = {
  service: {
    error: {
      userCreation: 'Error al crear el paciente',
      userExistence: 'El paciente ya existe en la base de datos',
      userFound: 'Paciente no encontrado',
      userFoundMany: 'Error al buscar pacientes',
      userInvalidId: 'ID de paciente inválido',
      userRemove: 'Error al eliminar el paciente',
      userUpdate: 'Error al actualizar el paciente',
    },
    success: {
      userCreation: 'Paciente creado con éxito',
      userFound: 'Paciente encontrado',
      userFoundMany: 'Pacientes encontrados',
      userFoundManyEmpty: 'No hay pacientes que coincidan con la búsqueda',
      userRemove: 'Paciente eliminado con éxito',
      userUpdate: 'Paciente actualizado con éxito',
    },
  },
  validation: {
    isEmail: {
      email: 'El email debe ser una cadena de texto con formato de email',
    },
    isInt: {
      dni: 'El DNI debe ser un número entero',
      phone: 'El teléfono debe ser un número entero',
    },
    isString: {
      firstName: 'El nombre debe ser una cadena de texto',
      lastName: 'El apellido debe ser una cadena de texto',
    },
    max: {
      dni: 'El DNI no debe superar los 8 dígitos',
      firstName: 'El nombre no debe superar los 30 caracteres',
      lastName: 'El apellido no debe superar los 30 caracteres',
      phone: 'El teléfono no debe superar los 10 dígitos',
    },
    min: {
      dni: 'El DNI debe poseer al menos 7 dígitos',
      firstName: 'El nombre debe poseer al menos 3 caracteres',
      lastName: 'El apellido debe poseer al menos 3 caracteres',
      phone: 'El teléfono debe poseer al menos 10 dígitos',
    },
  },
};
