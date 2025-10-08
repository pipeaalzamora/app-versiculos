// Mapeo de temas/sentimientos a referencias bíblicas específicas
// Estas referencias se usarán para consultar la API de la Biblia
export const TEMAS_REFERENCIAS = {
  tristeza: [
    { libro: 'salmos', capitulo: 34, versiculo: 18 },
    { libro: 'salmos', capitulo: 147, versiculo: 3 },
    { libro: 'mateo', capitulo: 5, versiculo: 4 },
    { libro: 'isaias', capitulo: 61, versiculo: '1-3' },
  ],
  soledad: [
    { libro: 'deuteronomio', capitulo: 31, versiculo: 6 },
    { libro: 'salmos', capitulo: 23, versiculo: 4 },
    { libro: 'josue', capitulo: 1, versiculo: 9 },
    { libro: 'hebreos', capitulo: 13, versiculo: 5 },
  ],
  miedo: [
    { libro: 'isaias', capitulo: 41, versiculo: 10 },
    { libro: '2-timoteo', capitulo: 1, versiculo: 7 },
    { libro: 'salmos', capitulo: 27, versiculo: 1 },
    { libro: 'josue', capitulo: 1, versiculo: 9 },
  ],
  ansiedad: [
    { libro: 'filipenses', capitulo: 4, versiculo: '6-7' },
    { libro: '1-pedro', capitulo: 5, versiculo: 7 },
    { libro: 'mateo', capitulo: 6, versiculo: '25-34' },
    { libro: 'salmos', capitulo: 55, versiculo: 22 },
  ],
  fe: [
    { libro: 'hebreos', capitulo: 11, versiculo: 1 },
    { libro: 'proverbios', capitulo: 3, versiculo: '5-6' },
    { libro: 'marcos', capitulo: 11, versiculo: 24 },
    { libro: 'romanos', capitulo: 10, versiculo: 17 },
  ],
  esperanza: [
    { libro: 'jeremias', capitulo: 29, versiculo: 11 },
    { libro: 'romanos', capitulo: 15, versiculo: 13 },
    { libro: 'salmos', capitulo: 42, versiculo: 11 },
    { libro: 'lamentaciones', capitulo: 3, versiculo: '22-23' },
  ],
  amor: [
    { libro: '1-corintios', capitulo: 13, versiculo: '4-8' },
    { libro: 'juan', capitulo: 3, versiculo: 16 },
    { libro: '1-juan', capitulo: 4, versiculo: '7-8' },
    { libro: 'romanos', capitulo: 8, versiculo: '38-39' },
  ],
  paz: [
    { libro: 'juan', capitulo: 14, versiculo: 27 },
    { libro: 'filipenses', capitulo: 4, versiculo: 7 },
    { libro: 'isaias', capitulo: 26, versiculo: 3 },
    { libro: 'colosenses', capitulo: 3, versiculo: 15 },
  ],
  fortaleza: [
    { libro: 'filipenses', capitulo: 4, versiculo: 13 },
    { libro: 'isaias', capitulo: 40, versiculo: 31 },
    { libro: 'salmos', capitulo: 46, versiculo: 1 },
    { libro: '2-corintios', capitulo: 12, versiculo: 9 },
  ],
  perdón: [
    { libro: '1-juan', capitulo: 1, versiculo: 9 },
    { libro: 'efesios', capitulo: 4, versiculo: 32 },
    { libro: 'colosenses', capitulo: 3, versiculo: 13 },
    { libro: 'mateo', capitulo: 6, versiculo: '14-15' },
  ],
  gratitud: [
    { libro: '1-tesalonicenses', capitulo: 5, versiculo: 18 },
    { libro: 'salmos', capitulo: 100, versiculo: '4-5' },
    { libro: 'filipenses', capitulo: 4, versiculo: 6 },
    { libro: 'colosenses', capitulo: 3, versiculo: 17 },
  ],
  sabiduría: [
    { libro: 'santiago', capitulo: 1, versiculo: 5 },
    { libro: 'proverbios', capitulo: 2, versiculo: '6-7' },
    { libro: 'proverbios', capitulo: 9, versiculo: 10 },
    { libro: 'colosenses', capitulo: 3, versiculo: 16 },
  ],
};

// Función para buscar temas que coincidan con el término de búsqueda
export const buscarTemasPorPalabra = (searchTerm) => {
  const termino = searchTerm.toLowerCase().trim();
  
  // Buscar coincidencias exactas o parciales
  const temasEncontrados = [];
  
  for (const [tema, referencias] of Object.entries(TEMAS_REFERENCIAS)) {
    if (tema.includes(termino) || termino.includes(tema)) {
      temasEncontrados.push({ tema, referencias });
    }
  }
  
  return temasEncontrados;
};

// Función para buscar temas por array de temas detectados por IA
export const buscarTemasPorArray = (temasArray) => {
  const temasEncontrados = [];
  
  for (const temaIA of temasArray) {
    const temaNormalizado = temaIA.toLowerCase().trim();
    
    // Buscar el tema en TEMAS_REFERENCIAS
    if (TEMAS_REFERENCIAS[temaNormalizado]) {
      temasEncontrados.push({ 
        tema: temaNormalizado, 
        referencias: TEMAS_REFERENCIAS[temaNormalizado] 
      });
    }
  }
  
  return temasEncontrados;
};
