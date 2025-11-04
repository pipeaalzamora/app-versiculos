import clientePromesa from '../lib/mongodb.js';

export default async function manejador(peticion, respuesta) {
  if (peticion.method === 'OPTIONS') {
    return respuesta.status(200).json({});
  }

  if (peticion.method !== 'POST') {
    return respuesta.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { userId, userEmail, versiculo, palabraAliento, busqueda } = peticion.body;

    if (!userId || !versiculo) {
      return respuesta.status(400).json({
        success: false,
        error: 'Se requiere userId y versiculo'
      });
    }

    const cliente = await clientePromesa;
    const db = cliente.db('biblia_help');
    const coleccion = db.collection('versiculos_guardados');

    const documento = {
      userId,
      userEmail,
      versiculo,
      palabraAliento,
      busqueda,
      fechaCreacion: new Date(),
    };

    const resultado = await coleccion.insertOne(documento);

    return respuesta.status(200).json({
      success: true,
      id: resultado.insertedId,
    });

  } catch (error) {
    console.error('Error al guardar versículo:', error);
    return respuesta.status(500).json({
      success: false,
      error: 'Error al guardar versículo',
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
