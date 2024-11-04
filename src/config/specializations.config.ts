export const SPECIALIZATIONS_CONFIG = {
  // TODO: add functionality on methods
  response: {
    error: {
      alreadyExist: 'La especialidad ya existe en la base de datos.',
      findingPlural: 'Error al buscar especialidades',
      invalidID: 'ID inválido. La estructura del ID es incorrecta',
      notCreated: 'Especialidad no creada',
      notFoundPlural: 'Especialidades no encontradas',
      notFoundSingular: 'Especialidad no encontrada',
      notRemoved: 'Especialidad no eliminada',
      notUpdated: 'Especialidad no actualizada',
    },
    success: {
      created: 'Especialidad creada con éxito',
      empty: 'No hay especialidades en la base de datos',
      foundPlural: 'Especialidades encontradas',
      foundSingular: 'Especialidad encontrada',
      removed: 'Especialidad eliminada con éxito',
      updated: 'Especialidad actualizada con éxito',
    },
  },
  validation: {
    isIn: {
      active: 'El estado debe ser 0 o 1',
    },
    isNotEmpty: {
      area: 'El area es obligatoria',
      description: 'La descripción es obligatoria',
      icon: 'El icono es obligatorio',
      name: 'El nombre es obligatorio',
      plural: 'El plural es obligatorio',
    },
    isNumber: {
      active: 'El estado debe ser un número',
    },
    isString: {
      area: 'El area debe ser una cadena de texto',
      description: 'La descripción debe ser una cadena de texto',
      icon: 'El icono debe ser una cadena de texto',
      name: 'El nombre debe ser una cadena de texto',
      plural: 'El plural debe ser una cadena de texto',
    },
  },
};
