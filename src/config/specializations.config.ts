export const SPECIALIZATIONS_CONFIG = {
  // TODO: add functionality on methods
  response: {
    error: {
      errorDuplicate: 'La especialidad ya existe en la base de datos.',
      errorFinding: 'Error al buscar especialidades en la base de datos',
      notCreated: 'La especialidad no se pudo crear en la base de datos',
      notDeleted: 'La especialidad no se pudo eliminar en la base de datos',
      notFound: 'Especialidad no encontrada en la base de datos',
      notUpdated: 'La especialidad no se pudo actualizar en la base de datos',
      notValid: 'ID inválido. La estructura del ID es incorrecta',
    },
    success: {
      created: 'Especialidad creada con éxito',
      deleted: 'Especialidad eliminada con éxito',
      empty: 'No hay especialidades en la base de datos',
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
      name: 'El nombre es obligatorio',
      plural: 'El plural es obligatorio',
    },
    isNumber: {
      active: 'El estado debe ser un número',
    },
    isString: {
      area: 'El area debe ser una cadena de texto',
      description: 'La descripción debe ser una cadena de texto',
      name: 'El nombre debe ser una cadena de texto',
      plural: 'El plural debe ser una cadena de texto',
    },
  },
};
