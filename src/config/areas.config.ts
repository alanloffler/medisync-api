export const AREAS_CONFIG = {
  response: {
    error: {
      errorDuplicate: 'Área ya existente',
      errorFinding: 'Error al buscar el área',
      errorFindingMany: 'Error al buscar las áreas',
      notCreated: 'Área no creada',
      notDeleted: 'Área no eliminada',
      notFound: 'Área no encontrada',
      notUpdated: 'Área no actualizada',
      notValid: 'ID inválido. La estructura del ID es incorrecta',
    },
    success: {
      created: 'Área creada',
      deleted: 'Área eliminada',
      empty: 'Área no existente',
      emptyMany: 'No existen áreas',
      found: 'Área encontrada',
      foundMany: 'Áreas encontradas',
      updated: 'Área actualizada',
    },
  },
  validation: {
    isIn: {
      active: 'El estado debe ser 0 o 1',
    },
    isNumber: {
      active: 'El estado debe ser un número',
    },
    isNotEmpty: {
      description: 'La descripción es obligatoria',
      name: 'El nombre es obligatorio',
      plural: 'El plural es obligatorio',
    },
    isString: {
      name: 'El nombre debe ser una cadena de texto',
      plural: 'El plural debe ser una cadena de texto',
      description: 'La descripción debe ser una cadena de texto',
    },
  },
};

errors: {

}