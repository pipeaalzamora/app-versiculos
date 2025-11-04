import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Guardar versículo y palabra de aliento en Firestore
 */
export const guardarVersiculoFavorito = async (userId, versiculo, palabraAliento, busqueda) => {
  try {
    const docRef = await addDoc(collection(db, 'versiculos_guardados'), {
      userId,
      versiculo,
      palabraAliento,
      busqueda,
      fechaCreacion: serverTimestamp(),
    });
    
    return {
      success: true,
      id: docRef.id
    };
  } catch (error) {
    console.error('Error al guardar versículo:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Obtener versículos guardados del usuario
 */
export const obtenerVersiculosGuardados = async (userId) => {
  try {
    const q = query(
      collection(db, 'versiculos_guardados'),
      where('userId', '==', userId),
      orderBy('fechaCreacion', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const versiculos = [];
    
    querySnapshot.forEach((doc) => {
      versiculos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      versiculos
    };
  } catch (error) {
    console.error('Error al obtener versículos:', error);
    return {
      success: false,
      error: error.message,
      versiculos: []
    };
  }
};
