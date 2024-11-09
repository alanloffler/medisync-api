export const DASHBOARD_CONFIG = {
  response: {
    error: {
      appointment: {
        count: 'Error al contar turnos',
        notFoundLatest: 'Error al buscar turnos recientes',
      },
      professional: {
        count: 'Error al contar profesionales',
        notFoundLatest: 'Error al buscar profesionales recientes',
      },
      user: {
        count: 'Error al contar pacientes',
        notFoundLatest: 'Error al buscar usuarios recientes',
      },
    },
    success: {
      appointment: {
        count: 'Total de turnos contados',
        foundLatest: 'Turnos recientes encontrados',
      },
      professional: {
        count: 'Total de profesionales contados',
        foundLatest: 'Profesionales recientes encontrados',
      },
      user: {
        count: 'Total de pacientes contados',
        foundLatest: 'Usuarios recientes encontrados',
      },
    },
  },
};
