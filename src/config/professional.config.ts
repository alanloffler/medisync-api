export const PROFESSIONAL_CONFIG = {
  validation: {
    configuration: {
      scheduleTimeInit: {
        isNotEmpty: 'La hora de inicio de agenda es obligatoria',
        isString: 'La hora de inicio de agenda debe ser hh:mm',
        minLength: 'La hora de inicio de agenda debe poseer 5 caracteres',
      },
      scheduleTimeEnd: {
        isNotEmpty: 'La hora de fin de agenda es obligatoria',
        isString: 'La hora de fin de agenda debe ser hh:mm',
        minLength: 'La hora de fin de agenda debe poseer 5 caracteres',
      },
      slotDuration: {
        isInt: 'La duración de los turnos debe ser un número entero',
        isPositive: 'La duración de los turnos debe ser un número positivo',
      },
      timeSlotUnavailableInit: {
        isNotEmpty: 'El inicio de los turnos no disponibles es obligatorio',
        isString: 'El inicio de los turnos no disponibles debe ser hh:mm',
        minLength: 'El inicio de los turnos no disponibles debe poseer 5 caracteres (hh:mm)',
      },
      timeSlotUnavailableEnd: {
        isNotEmpty: 'El fin de los turnos no disponibles es obligatorio',
        isString: 'El fin de los turnos no disponibles debe ser hh:mm',
        minLength: 'El fin de los turnos no disponibles debe poseer 5 caracteres (hh:mm)',
      },
    },
    createProfessionalDto: {
      area: {
        isNotEmpty: 'El área es obligatoria',
        isString: 'El área debe ser una cadena de texto',
      },
      available: {
        isBoolean: 'El estado de disponibilidad debe ser un booleano',
        isNotEmpty: 'El estado de disponibilidad es obligatorio',
      },
      specialization: {
        isNotEmpty: 'La especialidad es obligatoria',
        isString: 'La especialidad debe ser una cadena de texto',
      },
      titleAbbreviation: {
        isNotEmpty: 'La abreviatura del título es obligatoria',
        isString: 'La abreviatura del título debe ser una cadena de texto',
      }
    },
    workingDays: {
      arrayNotEmpty: 'Los días laborales son obligatorios',
      day: {
        isInt: 'El día debe ser un número entero',
        max: 'El día debe ser menor o igual a 5',
        min: 'El día debe ser mayor o igual a 0',
      },
      minLength: 'Los día laborables deben ser 6',
      value: {
        isBoolean: 'El valor debe ser un booleano',
      },
    },
  },
};
