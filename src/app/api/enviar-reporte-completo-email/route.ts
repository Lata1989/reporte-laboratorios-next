import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';

interface ReporteDB {
  _id: ObjectId;
  nombreDocente: string;
  laboratorio: string;
  horaDesde: string;
  horaHasta: string;
  fecha: string;
  reporte: {
    alumno?: string;
    observacion?: string;
  };
  createdAt: Date;
}

interface CSVRow {
  NombreDocente: string;
  Laboratorio: string;
  Fecha: string;
  HoraDesde: string;
  HoraHasta: string;
  Alumno: string;
  Observacion: string;
  CreatedAt: string;
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri as string);

async function connectDB() {
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    return client.db();
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    throw new Error('Error de conexión a la base de datos.');
  }
}

function generarCSV(data: CSVRow[]): string {
  if (!data || data.length === 0) {
    return "";
  }
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item =>
    Object.values(item)
      .map(value => {
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      })
      .join(',')
  ).join('\n');
  return `${headers}\n${rows}`;
}

export async function POST() {
  try {
    const db = await connectDB();
    const collection = db.collection<ReporteDB>('Reportes');

    const reportes = await collection.find({}).toArray();

    if (!reportes || reportes.length === 0) {
      return NextResponse.json({ message: 'No hay reportes para enviar por correo.' }, { status: 200 });
    }

    const csvDataArray: CSVRow[] = reportes.map(reporte => ({
      NombreDocente: reporte.nombreDocente,
      Laboratorio: reporte.laboratorio,
      Fecha: reporte.fecha,
      HoraDesde: reporte.horaDesde,
      HoraHasta: reporte.horaHasta,
      Alumno: reporte.reporte?.alumno || '',
      Observacion: reporte.reporte?.observacion || '',
      CreatedAt: reporte.createdAt.toLocaleString(),
    }));

    const csvData = generarCSV(csvDataArray);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER as string,
        pass: process.env.GMAIL_PASSWORD as string,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER as string,
      to: 'trinitariostic@gmail.com',
      subject: 'Reporte Completo de Laboratorios',
      html: '<p>Adjunto se encuentra el reporte completo de los laboratorios en formato CSV.</p>',
      attachments: [
        {
          filename: `reporte_completo_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`,
          content: csvData,
          contentType: 'text/csv',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    // Borrar la colección 'Reportes' después de enviar el email
    await db.collection('Reportes').drop();
    console.log('Colección "Reportes" eliminada.');

    return NextResponse.json({ message: 'Reporte completo enviado por correo electrónico como CSV y la base de datos limpiada.' }, { status: 200 });
  } catch (error) {
    console.error('Error al generar y enviar el reporte por email:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido al enviar el reporte por email';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await client.close();
    console.log('Conexión a MongoDB cerrada.');
  }
}