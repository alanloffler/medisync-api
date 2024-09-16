export const AREA_CONFIG = {
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
