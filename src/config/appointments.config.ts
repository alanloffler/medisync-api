export const APPOINTMENTS_CONFIG = {
  response: {
    error: {
      notCreated: 'Turno no creado',
      notFoundPlural: 'Turnos no encontrados',
      notFoundSingular: 'Turno no encontrado',
      notRemoved: 'Turno no eliminado',
    },
    success: {
      created: 'Turno creado',
      empty: 'El paciente aún no posee turnos',
      foundPlural: 'Turnos encontrados',
      foundSingular: 'Turno encontrado',
      removed: 'Turno eliminado',
    },
  },
  validation: {
    isInt: {
      slot: 'El turno debe ser un número entero',
    },
    isString: {
      day: 'El día debe ser una cadena de texto',
      hour: 'La hora debe ser una cadena de texto',
      professional: 'El ID del profesional debe ser una cadena de texto',
      user: 'El ID del usuario debe ser una cadena de texto',
    },
    isNotEmpty: {
      day: 'El día es obligatorio',
      hour: 'La hora es obligatoria',
      professional: 'El ID del profesional es obligatorio',
      user: 'El ID del usuario es obligatorio',
    },
  },
};
