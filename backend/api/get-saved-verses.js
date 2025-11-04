import clientePromesa from '../lib/mongodb.js';

export default async function manejador(peticion, respuesta) {
  if (peticion.method === 'OPTIONS') {
    return respuesta.status(200).json({});
  }

  if (peticion.method !== 'GET') {
    return respuesta.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { userId } = peticion.query;

    if (!userId) {
      return respuesta.status(400).json({
        success: false,
        error: 'Se requiere userId'
      });
    }

    const cliente = await clientePromesa;
    const db = cliente.db('biblia_help');
    const coleccion = db.collection('versiculos_guardados');

    const versiculos = await coleccion
      .find({ userId })
      .sort({ fechaCreacion: -1 })
      .limit(100)
      .toArray();

    return respuesta.status(200).json({
      success: true,
      versiculos,
    });

  } catch (error) {
    console.error('Error al obtener versículos:', error);
    return respuesta.status(500).json({
      success: false,
      error: 'Error al obtener versículos',
      versiculos: [],
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
