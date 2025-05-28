'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Footer } from '@/components/Footer'; // Importa el Footer

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
  } catch (error: unknown) { // Cambiamos a 'unknown'
    // Hacemos una verificación de tipo para acceder a 'message'
    if (error instanceof Error) {
      alert(`Error al comunicarse con el servidor: ${error.message}`);
    } else {
      alert('Error al comunicarse con el servidor: Error desconocido.');
    }
  }
}

export default function EnviarReporteEmailPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Enviar Reporte Completo
          </h1>
          <p className="text-gray-600 mb-4 text-center">
            Haz clic en el botón para generar y enviar un reporte de todos los informes guardados por correo electrónico.
          </p>
          <div className="flex justify-center mb-6">
            <button
              onClick={enviarReportePorEmail}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Enviar Reporte por Email
            </button>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Reportes Guardados</h2>
            <ReportesList />
          </div>
        </div>
      </div>
      <div className="mt-8"> {/* Agregamos margen superior aquí al contenedor del Footer */}
        <Footer developerName="Pablo Alejandro de la Iglesia" />
      </div>
    </div>
  );
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
        // También aplicamos la misma lógica aquí
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

  return (
    <ul className="list-disc pl-6 text-gray-700">
      {reportes.map(reporte => (
        <li key={reporte._id}>
          {reporte.nombreDocente} - {reporte.laboratorio} ({reporte.fecha})
        </li>
      ))}
    </ul>
  );
}