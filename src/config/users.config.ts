export const USERS_CONFIG = {
  response: {
    error: {
      alreadyExist: 'El paciente ya existe',
      invalidId: 'ID de paciente inválido',
      notCreated: 'Paciente no creado',
      notFoundPlural: 'Pacientes no encontrados',
      notFoundSingular: 'Paciente no encontrado',
      notRemoved: 'Paciente no eliminado',
      notUpdated: 'Paciente no actualizado',
    },
    success: {
      created: 'Paciente creado',
      foundSingular: 'Paciente encontrado',
      foundPlural: 'Pacientes encontrados',
      foundEmptyPlural: 'No hay pacientes que coincidan con la búsqueda',
      removed: 'Paciente eliminado',
      updated: 'Paciente actualizado',
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
