export const APPOINTMENTS_CONFIG = {
  response: {
    error: {
      notCreated: 'Turno no creado',
      notFoundPlural: 'Turnos no encontrados',
      notFoundSingular: 'Turno no encontrado',
      notFoundYears: 'Error al buscar los distintos años de turnos',
      notRemoved: 'Turno no eliminado',
    },
    success: {
      created: 'Turno creado',
      empty: 'El paciente aún no posee turnos',
      emptyYears: 'No se encontraron los distintos años de turnos',
      foundPlural: 'Turnos encontrados',
      foundSingular: 'Turno encontrado',
      foundYears: 'Se encontraron los distintos años de turnos',
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
