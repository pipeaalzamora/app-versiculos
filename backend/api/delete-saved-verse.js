import clientePromesa from '../lib/mongodb.js';
import { ObjectId } from 'mongodb';

export default async function manejador(peticion, respuesta) {
  if (peticion.method === 'OPTIONS') {
    return respuesta.status(200).json({});
  }

  if (peticion.method !== 'DELETE') {
    return respuesta.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { id, userId } = peticion.body;

    if (!id || !userId) {
      return respuesta.status(400).json({
        success: false,
        error: 'Se requiere id y userId'
      });
    }

    const cliente = await clientePromesa;
    const db = cliente.db('biblia_help');
    const coleccion = db.collection('versiculos_guardados');

    // Verificar que el versículo pertenece al usuario
    const resultado = await coleccion.deleteOne({
      _id: new ObjectId(id),
      userId: userId
    });

    if (resultado.deletedCount === 0) {
      return respuesta.status(404).json({
        success: false,
        error: 'Versículo no encontrado o no autorizado'
      });
    }

    return respuesta.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error('Error al eliminar versículo:', error);
    return respuesta.status(500).json({
      success: false,
      error: 'Error al eliminar versículo',
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
