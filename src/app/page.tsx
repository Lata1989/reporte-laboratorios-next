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

export default function Home() {
    const [nombreDocente, setNombreDocente] = useState('');
    const [laboratorio, setLaboratorio] = useState('');
    const [horaDesde, setHoraDesde] = useState('');
    const [horaHasta, setHoraHasta] = useState('');
    const [reporte, setReporte] = useState<Reporte>({});
    const [errorLaboratorio, setErrorLaboratorio] = useState('');
    const [errorHorario, setErrorHorario] = useState('');

    const handleNombreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNombreDocente(event.target.value);
    };

    const handleLaboratorioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLaboratorio(event.target.value);
        setErrorLaboratorio(''); // Limpiar el error al cambiar el laboratorio
    };

    const handleHoraDesdeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHoraDesde(event.target.value);
        setErrorHorario(''); // Limpiar el error al cambiar la hora de inicio
    };

    const handleHoraHastaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHoraHasta(event.target.value);
        setErrorHorario(''); // Limpiar el error al cambiar la hora de fin
    };

    const handleReporteChange = (campo: keyof Reporte, valor: string) => {
        setReporte((prevReporte) => ({
            ...prevReporte,
            [campo]: valor,
        }));
    };

    const guardarInforme = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setErrorLaboratorio('');
        setErrorHorario('');

        let isValid = true;

        if (!laboratorio) {
            setErrorLaboratorio('Por favor, selecciona un laboratorio.');
            isValid = false;
        }

        if (horaHasta && horaDesde && horaHasta <= horaDesde) {
            setErrorHorario('La hora de finalización debe ser posterior a la hora de inicio.');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const formData = {
            nombreDocente,
            laboratorio,
            horaDesde,
            horaHasta,
            fecha: new Date().toLocaleDateString(),
            reporte: { ...reporte },
        };

        try {
            const response = await fetch('/api/guardar-informe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorResult = await response.text();
                console.error('Error del backend al guardar:', errorResult);
                alert(`Error al guardar el informe: ${errorResult || 'Error desconocido'}`);
                return;
            }

            const result = await response.json();
            console.log('Informe guardado exitosamente:', result);
            alert('Informe guardado correctamente en la base de datos!');

            setNombreDocente('');
            setLaboratorio('');
            setHoraDesde('');
            setHoraHasta('');
            setReporte({});

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
            />
            {errorLaboratorio && <p className="text-red-500">{errorLaboratorio}</p>}
            <HorarioFecha
                horaDesde={horaDesde}
                onHoraDesdeChange={handleHoraDesdeChange}
                horaHasta={horaHasta}
                onHoraHastaChange={handleHoraHastaChange}
            />
            {errorHorario && <p className="text-red-500">{errorHorario}</p>}
            <ReporteMaquinas reporte={reporte} onReporteChange={handleReporteChange} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button onClick={guardarInforme}>Guardar Informe</button>
            </div>
            <Footer developerName="Pablo Alejandro de la Iglesia" />
        </div>
    );
}