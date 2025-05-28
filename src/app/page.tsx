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
    numeroMaquina?: string; // Nuevo campo
}

export default function Home() {
    const [nombreDocente, setNombreDocente] = useState('');
    const [laboratorio, setLaboratorio] = useState('');
    const [horaDesde, setHoraDesde] = useState('');
    const [horaHasta, setHoraHasta] = useState('');
    const [reporte, setReporte] = useState<Reporte>({}); // Actualizamos el tipo de estado
    const [errorLaboratorio, setErrorLaboratorio] = useState('');
    const [errorHorario, setErrorHorario] = useState('');
    const [errorNombreDocente, setErrorNombreDocente] = useState(''); // Nuevo estado de error

    const handleNombreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNombreDocente(event.target.value);
    };

    const handleLaboratorioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLaboratorio(event.target.value);
        setErrorLaboratorio('');
    };

    const handleHoraDesdeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHoraDesde(event.target.value);
        setErrorHorario('');
    };

    const handleHoraHastaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHoraHasta(event.target.value);
        setErrorHorario('');
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
        setErrorNombreDocente(''); // Reiniciar error del nombre

        let isValid = true;

        if (!nombreDocente) {
            setErrorNombreDocente('Por favor, ingresa el nombre del docente.');
            isValid = false;
        }

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
            reporte: { ...reporte }, // El reporte ahora incluye numeroMaquina
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
        <div className="p-4"> {/* Añadimos un poco de padding al contenedor principal */}
            <h1 className="text-3xl font-semibold text-center mb-6">Reporte de laboratorio</h1> {/* Centramos y damos margen inferior */}
            <DocenteInfo
                onNombreChange={handleNombreChange}
                nombreDocente={nombreDocente}
                laboratorio={laboratorio}
                onLaboratorioChange={handleLaboratorioChange}
            />
            {errorNombreDocente && <p className="text-red-500">{errorNombreDocente}</p>}
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
                <button onClick={guardarInforme} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Guardar Informe</button> {/* Estilo básico del botón */}
            </div>
            <div className="mt-8">
                <Footer developerName="Pablo Alejandro de la Iglesia" />
            </div>
        </div>
    );
}