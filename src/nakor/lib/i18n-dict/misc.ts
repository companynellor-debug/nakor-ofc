import type { Dict } from './index';

/** Chaves diversas: círculo de foco, histórico, edição de atividade e preferências de card. */
export const miscDict: Dict = {
  // Focus circle
  'Tempo Focado Hoje': { en: 'Focus Time Today', es: 'Tiempo Enfocado Hoy' },
  'Comece sua primeira sessão': {
    en: 'Start your first session',
    es: 'Empieza tu primera sesión',
  },
  'Meta de hoje alcançada': { en: "Today's goal reached", es: 'Meta de hoy alcanzada' },
  'Nota média': { en: 'Average score', es: 'Nota promedio' },

  // Card preferences
  'Pré-visualização': { en: 'Preview', es: 'Vista previa' },
  'Normal': { en: 'Normal', es: 'Normal' },
  'Compacto': { en: 'Compact', es: 'Compacto' },
  'Opacidade do fundo': { en: 'Background opacity', es: 'Opacidad del fondo' },
  'Modelo do card': { en: 'Card style', es: 'Estilo de tarjeta' },
  'Cor personalizada': { en: 'Custom color', es: 'Color personalizado' },
  'Preferência salva!': { en: 'Preference saved!', es: '¡Preferencia guardada!' },
  'Salvar preferência': { en: 'Save preference', es: 'Guardar preferencia' },
  'Todas as próximas atividades usam automaticamente este modelo e esta cor.': {
    en: 'All future activities automatically use this style and color.',
    es: 'Todas las próximas actividades usan automáticamente este estilo y color.',
  },

  'Sessões': { en: 'Sessions', es: 'Sesiones' },
  'Dias ativos ': { en: 'Active days ', es: 'Días activos ' },

  // History / sharing
  'Copiado!': { en: 'Copied!', es: '¡Copiado!' },
  'Copiar card': { en: 'Copy card', es: 'Copiar tarjeta' },
  'Progresso': { en: 'Progress', es: 'Progreso' },

  // Activity editing
  'Editar atividade': { en: 'Edit activity', es: 'Editar actividad' },
  'Projeto': { en: 'Project', es: 'Proyecto' },
  'Sem projeto': { en: 'No project', es: 'Sin proyecto' },
  'Novo projeto': { en: 'New project', es: 'Nuevo proyecto' },
  'Excluir atividade': { en: 'Delete activity', es: 'Eliminar actividad' },
  'PROJETO': { en: 'PROJECT', es: 'PROYECTO' },
  'opcional': { en: 'optional', es: 'opcional' },
  'Nome do projeto': { en: 'Project name', es: 'Nombre del proyecto' },
  'O que você espera dessa atividade?\\nQual é sua meta agora?': {
    en: 'What do you expect from this activity?\nWhat is your goal right now?',
    es: '¿Qué esperas de esta actividad?\n¿Cuál es tu meta ahora?',
  },

  // Progress / stats
  'Tempo de trabalho': { en: 'Work time', es: 'Tiempo de trabajo' },
  'vs período anterior': { en: 'vs previous period', es: 'vs período anterior' },
  'dias ativos': { en: 'active days', es: 'días activos' },
  'recorde': { en: 'record', es: 'récord' },
  'Trabalho por projeto': { en: 'Work by project', es: 'Trabajo por proyecto' },
  'Provas de trabalho': { en: 'Proof of work', es: 'Pruebas de trabajo' },
};
