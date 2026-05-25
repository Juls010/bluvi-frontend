// ─── User type ────────────────────────────────────────────────────────────────
// Refleja exactamente lo que devuelve GET /api/users/profile

export interface User {
  id_user: number;
  email: string;
  first_name: string;
  last_name: string;
  atmosphere?: 'normal' | 'tranquilo' | 'bajo';
  birth_date: string;       
  city: string;
  city_lat?: number | null;
  city_lng?: number | null;
  description: string;
  id_gender: number;
  sexuality: number[];      
  photos: (string | null)[];
  main_photo?: string;
  is_face_verified?: boolean;
  match_status?: 'pending' | 'accepted';
  can_chat?: boolean;
  interests: string[];      
  features: string[]; 
  communication_style: string[]; 
  interest_names?: string[];
  neurodivergence_names?: string[];
  communication_names?: string[];
  id_interests?: number[];
  id_neurodivergences?: number[];
  id_communication_style?: number[];
}


export const GENDER_LABELS: Record<number, string> = {
  1: 'Mujer',
  2: 'Hombre',
  3: 'No binario',
  4: 'Prefiero no decirlo'
};

export const SEXUALITY_LABELS: Record<number, string> = {
  1: 'Heterosexual',
  2: 'Bisexual',
  3: 'Gay',
  4: 'Lesbiana',
  5: 'Pansexual',
  6: 'Asexual',
  7: 'Otros',
};

export const NEURODIVERGENCE_LABELS: Record<number, string> = {
  1:  'ADHD',
  2:  'Autismo',
  3:  'Dislexia',
  4:  'Discalculia',
  5:  'Dispraxia',
  6:  'Síndrome Tourette',
  7:  'Ansiedad',
  8:  'Ansiedad Social',
  9:  'Depresión',
  10: 'Bipolar',
  11: 'TOC',
  12: 'TLP',
  13: 'PAS (Alta Sensibilidad)',
  14: 'ARFID',
  15: 'Síndrome Down',
  16: 'Discapacidad intelectual',
  17: 'Parálisis cerebral',
  18: 'Tartamudez',
};

export const COMMUNICATION_LABELS: Record<number, string> = {
  1:  'Mensajes de texto',
  2:  'Notas de voz',
  3:  'Videollamadas',
  4:  'Llamadas de voz',
  5:  'Memes',
  6:  'Directa y literal',
  7:  'Conversación casual',
  8:  'Conversación profunda',
  9:  'Lento y reflexivo',
  10: 'Pocas palabras',
  11: 'Párrafos largos',
  12: 'Infodumping',
  13: 'Ecolalia',
  14: 'Compañía silenciosa',
};

export const INTEREST_LABELS: Record<number, string> = {
  1:  'Anime',
  2:  'Senderismo',
  3:  'Gimnasio',
  4:  'Cine',
  5:  'Viajar',
  6:  'Cocina',
  7:  'Música',
  8:  'Gaming',
  9:  'Comida',
  10: 'Historia',
  12: 'Salud',
  13: 'Naturaleza',
  14: 'Feminismo',
  15: 'Deporte',
  16: 'Playa',
  17: 'Magia',
  18: 'Veganismo',
  20: 'Mascotas',
  21: 'LGTBIQ+',
  22: 'Matemáticas',
  23: 'Poliamor',
  24: 'Diseño',
  25: 'Moda',
  26: 'Trenes',
  27: 'Ciencia ficción',
  28: 'Fotografía',
  29: 'Videojuegos',
  30: 'Humor',
  31: 'K-Pop',
  32: 'Montaña',
  33: 'Muñecos',
  34: 'Cosplay',
  35: 'Religión',
  36: 'Lectura',
  37: 'Comics',
  38: 'Tecnología',
  39: 'Picnic',
  40: 'Puzzles',
  41: 'Paseos',
  42: 'Maquetas',
};



export const idsToLabels = (ids: number[] | undefined, labelsRecord: Record<number, string>): string[] => {
  if (!ids || !Array.isArray(ids)) return [];
  return ids
    .map(id => labelsRecord[id]) 
    .filter(label => !!label);   
};
