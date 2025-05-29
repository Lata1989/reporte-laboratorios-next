'use client';

import React, { useState, useEffect } from 'react';
import { Footer } from '@/components/Footer'; // Asegúrate de que la ruta al Footer sea correcta

interface ReporteData {
  _id: string;
  nombreDocente: string;
  laboratorio: string;
  horaDesde: string;
  horaHasta: string;
  fecha: string;
  reporte: {
    alumno?: string;
    observacion?: string;
    numeroMaquina?: string;
  };
  createdAt?: string;
}

async function obtenerReportes(): Promise<ReporteData[]> {
  const response = await fetch('/api/obtener-reportes');
  if (!response.ok) {
    const message = `Error: ${response.status}`;
    throw new Error(message);
  }
  return await response.json();
}

async function enviarReportePorEmail() {
  try {
    const response = await fetch('/api/enviar-reporte-completo-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
    } else {
      alert(`Error al enviar el reporte por email: ${result.error}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`Error al comunicarse con el servidor: ${error.message}`);
    } else {
      alert('Error al comunicarse con el servidor: Error desconocido.');
    }
  }
}

function ReportesList() {
  const [reportes, setReportes] = useState<ReporteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerReportes()
      .then(data => {
        setReportes(data);
        setIsLoading(false);
      })
      .catch(err => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error desconocido al cargar los reportes.');
        }
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <p className="text-gray-600 text-center">Cargando reportes...</p>;
  if (error) return <p className="text-red-500 text-center">Error al cargar los reportes: {error}</p>;

  const formatAlumnos = (alumnos?: string): React.ReactNode => {
    if (!alumnos) return 'N/A';
    const alumnosArray = alumnos.split(',').map(alumno => alumno.trim());
    if (alumnosArray.length === 1) {
      return alumnosArray[0];
    }
    return (
      <ul>
        {alumnosArray.map((alumno, index) => (
          <li key={index} className="text-gray-800">{alumno}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full w-full bg-white shadow-md rounded-lg"> {/* Añadido w-full */}
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-gray-700">Docente</th>
            <th className="px-4 py-2 text-left text-gray-700">Laboratorio</th>
            <th className="px-4 py-2 text-left text-gray-700">Fecha</th>
            <th className="px-4 py-2 text-left text-gray-700">Hora Desde</th>
            <th className="px-4 py-2 text-left text-gray-700">Hora Hasta</th>
            <th className="px-4 py-2 text-left text-gray-700">Máquina</th>
            <th className="px-4 py-2 text-left text-gray-700">Alumnos</th>
            <th className="px-4 py-2 text-left text-gray-700">Observación</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map(reporte => (
            <tr key={reporte._id} className="hover:bg-gray-50 text-gray-800"> {/* Añadido text-gray-800 a la fila */}
              <td className="px-4 py-2">{reporte.nombreDocente}</td>
              <td className="px-4 py-2">{reporte.laboratorio}</td>
              <td className="px-4 py-2">{reporte.fecha}</td>
              <td className="px-4 py-2">{reporte.horaDesde}</td>
              <td className="px-4 py-2">{reporte.horaHasta}</td>
              <td className="px-4 py-2">{reporte.reporte?.numeroMaquina || 'N/A'}</td>
              <td className="px-4 py-2">{formatAlumnos(reporte.reporte?.alumno)}</td>
              <td className="px-4 py-2">{reporte.reporte?.observacion || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function EnviarReporteEmailPage() {
  return (
    <div className="min-h-screen flex flex-col"> {/* Quitamos bg-gray-100 y justify-center sm:py-12 */}
      <div className="relative py-3 w-full"> {/* Añadido w-full */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 mx-auto max-w-7xl"> {/* Añadido mx-auto max-w-7xl para centrar el contenido y limitar su ancho máximo */}
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Enviar reporte por correo
          </h1>
          <p className="text-gray-600 mb-4 text-center">
            Haz clic en el botón para generar y enviar un reporte de todos los informes guardados por correo electrónico.
          </p>
          <div className="flex justify-center mb-6">
            <button
              onClick={enviarReportePorEmail}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Enviar reporte
            </button>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Reportes Guardados</h2>
            <ReportesList />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Footer developerName="Pablo Alejandro de la Iglesia" />
      </div>
    </div>
  );
}