import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// URI de conexión a MongoDB (desde tus variables de entorno)
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri as string);

async function connectDB() {
    try {
        await client.connect();
        return client.db(); // Devuelve la instancia de la base de datos
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        throw new Error('Error de conexión a la base de datos.');
    }
}

export async function POST(req: NextRequest) {
    try {
        const db = await connectDB();
        const collection = db.collection('Reportes'); // Nombre de la colección

        const data = await req.json();
        console.log('Datos recibidos para guardar:', data);

        const { nombreDocente, laboratorio, horaDesde, horaHasta, fecha, reporte } = data;

        // Insertar el documento en la colección
        const result = await collection.insertOne({
            nombreDocente,
            laboratorio,
            horaDesde,
            horaHasta,
            fecha,
            reporte: { ...reporte }, // Guardamos todo el objeto reporte
            createdAt: new Date(),
        });

        console.log('Informe guardado con ID:', result.insertedId);

        return NextResponse.json(
            { message: 'Informe guardado correctamente en la base de datos.', insertedId: result.insertedId },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error al guardar el informe:', error);
        const message = error instanceof Error ? error.message : 'Error desconocido al guardar el informe';
        return NextResponse.json({ error: message }, { status: 500 });
    } finally {
        await client.close();
        console.log('Conexión a MongoDB cerrada.');
    }
}