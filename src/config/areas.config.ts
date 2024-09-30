export const AREAS_CONFIG = {
  response: {
    error: {
      duplicated: 'Área ya existente',
      findingPlural: 'Error al buscar las áreas',
      findingSingular: 'Error al buscar el área',
      notCreated: 'Área no creada',
      notFoundSingular: 'Área no encontrada',
      notRemoved: 'Área no eliminada',
      notUpdated: 'Área no actualizada',
      notValid: 'ID inválido. La estructura del ID es incorrecta',
    },
    success: {
      created: 'Área creada',
      emptyPlural: 'Áreas no existentes',
      emptySingular: 'Área no existente',
      foundPlural: 'Áreas encontradas',
      foundSingular: 'Área encontrada',
      removed: 'Área eliminada',
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
