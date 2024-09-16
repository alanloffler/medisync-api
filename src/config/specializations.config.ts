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
};
