// /app/api/email-report/route.ts
import { NextRequest, NextResponse } from 'next/server';
import exceljs from 'exceljs';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Datos recibidos en la API:', data);

    const { nombreDocente, laboratorio, horaDesde, horaHasta, fecha, reportes } = data;

    // Generar el archivo Excel
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Laboratorio');

    worksheet.addRow(['Nombre del Docente', nombreDocente]);
    worksheet.addRow(['Laboratorio', laboratorio]);
    worksheet.addRow(['Fecha', fecha]);
    worksheet.addRow(['Hora Desde', horaDesde, 'Hora Hasta', horaHasta]);
    worksheet.addRow([]);

    worksheet.addRow(['Máquina', 'Apellido del Alumno', 'Observaciones']);
    reportes.forEach((report: { maquina: string; alumno: string; observacion: string }) => {
      worksheet.addRow([report.maquina, report.alumno, report.observacion]);
    });

    const excelBuffer = await workbook.xlsx.writeBuffer();

    // Configurar transporte de correo
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'trinitariostic@gmail.com',
      subject: `Reporte de Laboratorio - ${laboratorio} - ${fecha}`,
      html: `
        <p>Adjunto se encuentra el reporte de laboratorio.</p>
        <p><strong>Docente:</strong> ${nombreDocente}</p>
        <p><strong>Laboratorio:</strong> ${laboratorio}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Horario:</strong> ${horaDesde} - ${horaHasta}</p>
      `,
      attachments: [
        {
          filename: `reporte_laboratorio_${laboratorio}_${fecha}.xlsx`,
          content: Buffer.from(excelBuffer as ArrayBuffer),
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Correo electrónico enviado correctamente con el archivo Excel adjunto.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
