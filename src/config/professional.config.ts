export const PROFESSIONAL_CONFIG = {
  validation: {
    workingDays: {
      notEmptyArray: 'Los días laborales son obligatorios',
      minLength: 'Los día laborables deben ser 6',
    },
    day: {
      message: 'El día debe ser un número',
      min: 'El día debe ser mayor o igual a 0',
      max: 'El día debe ser menor o igual a 5',
    },
    value: {
      message: 'El valor debe ser un booleano',
    },
  }
}