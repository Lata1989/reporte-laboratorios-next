'use client';

import '../styles/page.css';
import { useState } from 'react';
import { DocenteInfo } from '@/components/DocenteInfo';
import { HorarioFecha } from '@/components/HorarioFecha';
import { ReporteMaquinas } from '@/components/ReporteMaquinas';
import { Footer } from '@/components/Footer';

interface Reporte {
    alumno?: string;
    observacion?: string;
}

interface Reportes {
    [key: string]: Reporte | undefined;
}

export default function Home() {
    const [nombreDocente, setNombreDocente] = useState('');
    const [laboratorio, setLaboratorio] = useState('');
    const [horaDesde, setHoraDesde] = useState('');
    const [horaHasta, setHoraHasta] = useState('');
    const [reportes, setReportes] = useState<Reportes>({});
    const laboratoriosDisponibles: string[] = ['Laboratorio 1', 'Laboratorio 2', 'Laboratorio 3'];

    const handleNombreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNombreDocente(event.target.value);
    };

    const handleLaboratorioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLaboratorio(event.target.value);
    };

    const handleHoraDesdeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHoraDesde(event.target.value);
    };

    const handleHoraHastaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHoraHasta(event.target.value);
    };

    const handleReporteChange = (maquinaId: string, campo: keyof Reporte, valor: string) => {
        setReportes((prevReportes) => ({
            ...prevReportes,
            [maquinaId]: {
                ...prevReportes[maquinaId],
                [campo]: valor,
            },
        }));
    };

    const enviarCorreo = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const formData = {
            nombreDocente,
            laboratorio,
            horaDesde,
            horaHasta,
            fecha: new Date().toLocaleDateString(),
            reportes: Object.entries(reportes).map(([maquina, reporte]) => ({
                maquina,
                alumno: reporte?.alumno || '',
                observacion: reporte?.observacion || '',
            })),
        };

        try {
            const response = await fetch('/api/email-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorResult = await response.text();
                console.error('Error del backend:', errorResult);
                alert(`Error al enviar el reporte: ${errorResult || 'Error desconocido'}`);
                return;
            }

            const result = await response.json();
            console.log('Respuesta del backend:', result);
            alert('Reporte enviado por correo electrónico con archivo Excel!');

        } catch (error) {
            console.error('Error al comunicarse con el backend:', error);
            alert('Error al comunicarse con el servidor.');
        }
    };

    return (
        <div>
            <h1>Reporte de Laboratorio</h1>
            <DocenteInfo
                onNombreChange={handleNombreChange}
                nombreDocente={nombreDocente}
                laboratorio={laboratorio}
                onLaboratorioChange={handleLaboratorioChange}
                laboratorios={laboratoriosDisponibles}
            />
            <HorarioFecha
                horaDesde={horaDesde}
                onHoraDesdeChange={handleHoraDesdeChange}
                horaHasta={horaHasta}
                onHoraHastaChange={handleHoraHastaChange}
            />
            <ReporteMaquinas reportes={reportes} onReporteChange={handleReporteChange} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button onClick={enviarCorreo}>Enviar reporte por email</button>
            </div>
            <Footer developerName="Pablo Alejandro de la Iglesia" />
        </div>
    );
}