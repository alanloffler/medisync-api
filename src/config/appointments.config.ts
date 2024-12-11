export const APPOINTMENTS_CONFIG = {
  inlineValidation: {
    limit: 'El límite debe ser un número entero mayor o igual a 0',
    page: 'La página debe ser un número entero mayor o igual a 0',
  },
  response: {
    error: {
      notCount: 'Error al contar turnos',
      notCreated: 'Turno no creado',
      notFoundMonths: 'Error al buscar los distintos meses de turnos',
      notFoundPlural: 'Turnos no encontrados',
      notFoundSingular: 'Turno no encontrado',
      notFoundUniqueProfessionals: 'Error al buscar profesionales únicos',
      notFoundYears: 'Error al buscar los distintos años de turnos',
      notRemoved: 'Turno no eliminado',
    },
    success: {
      count: 'Total de turnos contados',
      created: 'Turno creado',
      empty: 'El paciente aún no posee turnos',
      emptyMonths: 'No se encontraron los distintos meses de turnos',
      emptyUniqueProfessionals: 'No se encontraron profesionales únicos',
      emptyYears: 'No se encontraron los distintos años de turnos',
      foundMonths: 'Se encontraron los distintos meses de turnos',
      foundPlural: 'Turnos encontrados',
      foundSingular: 'Turno encontrado',
      foundUniqueProfessionals: 'Se encontraron los profesionales únicos',
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
