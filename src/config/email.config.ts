export const EMAIL_CONFIG = {
  response: {
    error: {
      notSend: 'Email no enviado',
    },
    success: {
      send: 'Email enviado con éxito',
    },
  },
  validation: {
    isEmail: {
      recipients: 'Cada contenido del recipiente debe ser un email',
    },
    isString: {
      html: 'El contenido debe ser una cadena de texto',
      subject: 'El sujeto debe ser una cadena de texto',
      text: 'El texto debe ser una cadena de texto',
    },
  },
};
