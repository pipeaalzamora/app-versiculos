import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let cliente;
let clientePromesa;

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor agrega MONGODB_URI a las variables de entorno');
}

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usar una variable global para preservar el cliente entre recargas
  if (!global._mongoClientePromesa) {
    cliente = new MongoClient(uri, options);
    global._mongoClientePromesa = cliente.connect();
  }
  clientePromesa = global._mongoClientePromesa;
} else {
  // En producción, crear un nuevo cliente
  cliente = new MongoClient(uri, options);
  clientePromesa = cliente.connect();
}

export default clientePromesa;
