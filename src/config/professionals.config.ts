export const PROFESSIONALS_CONFIG = {
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
    dto: {
      isBoolean: {
        available: 'El estado de disponibilidad debe ser un booleano',
      },
      isEmail: {
        email: 'El email debe ser un email válido',
      },
      isNotEmpty: {
        area: 'El área es obligatoria',
        available: 'El estado de disponibilidad es obligatorio',
        configuration: 'La configuración es obligatoria',
        dni: 'El DNI es obligatorio',
        email: 'El email es obligatorio',
        firstName: 'El nombre es obligatorio',
        lastName: 'El apellido es obligatorio',
        phone: 'El teléfono es obligatorio',
        specialization: 'La especialización es obligatoria',
        title: 'El título es obligatorio',
      },
      isNumber: {
        dni: 'El DNI debe ser un número',
        phone: 'El teléfono debe ser un número',
      },
      isObject: {
        configuration: 'La configuración debe ser un objeto',
      },
      isString: {
        area: 'El área debe ser una cadena de texto',
        description: 'La descripción debe ser una cadena de texto',
        email: 'El email debe ser una cadena de texto',
        firstName: 'El nombre debe ser una cadena de texto',
        lastName: 'El apellido debe ser una cadena de texto',
        specialization: 'La especialidad debe ser una cadena de texto',
        title: 'El título debe ser una cadena de texto',
      },
    },
    workingDays: {
      arrayNotEmpty: 'Los días laborales son obligatorios',
      day: {
        isInt: 'El día debe ser un número entero',
        max: 'El día debe ser menor o igual a 6',
        min: 'El día debe ser mayor o igual a 0',
      },
      minLength: 'Los día laborables deben ser 7',
      value: {
        isBoolean: 'El valor debe ser un booleano',
      },
    },
  },
};
