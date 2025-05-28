import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri as string);

async function connectDB() {
  try {
    await client.connect();
    return client.db();
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    throw new Error('Error de conexión a la base de datos.');
  }
}

export async function GET() {
  try {
    const db = await connectDB();
    const collection = db.collection('Reportes');

    const reportes = await collection.find({}).toArray();

    return NextResponse.json(reportes, { status: 200 });
  } catch (error) {
    console.error('Error al obtener los reportes:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido al obtener los reportes';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await client.close();
    console.log('Conexión a MongoDB cerrada.');
  }
}