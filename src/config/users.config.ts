export const USERS_CONFIG = {
  response: {
    error: {
      alreadyExist: 'El paciente ya existe en la base de datos. El DNI que intentas utilizar ya se ha registrado como paciente.',
      databaseCount: 'Error al obtener el total de usuarios',
      invalidId: 'ID de paciente inválido',
      notCreated: 'Paciente no creado. Inténtalo nuevamente.',
      notFoundPlural: 'Pacientes no encontrados',
      notFoundSingular: 'Paciente no encontrado',
      notRemoved: 'Ha ocurrido un error y el paciente no ha sido eliminado. Inténtalo nuevamente.',
      notUpdated: 'Ha ocurrido un error y el paciente no ha sido actualizado. Inténtalo nuevamente.',
    },
    success: {
      created: 'Paciente creado',
      databaseCount: 'Resumen de usuarios en la base de datos',
      emptyDatabase: 'No existen pacientes en la base de datos',
      foundEmptyPlural: 'Búsqueda sin resultados',
      foundPlural: 'Pacientes encontrados',
      foundSingular: 'Paciente encontrado',
      removed: 'Paciente eliminado',
      updated: 'Paciente actualizado',
    },
  },
  inlineValidation: {
    month: 'El mes debe estar comprendido entre 1 y 12',
    year: 'El año debe estar comprendido entre 2022 y el presente',
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
