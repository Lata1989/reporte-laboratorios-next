import React from 'react';

interface ReporteProps {
  alumno?: string;
  observacion?: string;
  numeroMaquina?: string; // Sigue siendo string, pero validaremos que contenga solo números
}

interface ReporteMaquinasProps {
  reporte: ReporteProps;
  onReporteChange: (campo: keyof ReporteProps, valor: string) => void;
}

export const ReporteMaquinas: React.FC<ReporteMaquinasProps> = ({ reporte, onReporteChange }) => {
  const handleNumeroMaquinaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir caracteres numéricos
    const value = e.target.value.replace(/[^0-9]/g, '');
    onReporteChange('numeroMaquina', value);
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Reporte de la máquina</h2>
      <div className="flex flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="alumno" className="block text-gray-700 text-sm font-bold mb-2">
            Apellido del estudiante:
          </label>
          <input
            type="text"
            id="alumno"
            value={reporte.alumno || ''}
            onChange={(e) => onReporteChange('alumno', e.target.value)}
            placeholder="Si son grupo poner todos los apellidos"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="numeroMaquina" className="block text-gray-700 text-sm font-bold mb-2">
            Número de máquina:
          </label>
          <input
            type="text" // Cambiado a 'text'
            id="numeroMaquina"
            value={reporte.numeroMaquina || ''}
            onChange={handleNumeroMaquinaChange} // Usamos la nueva función de manejo
            placeholder="Número de máquina"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {/* Ya no necesitamos el bloque style jsx para ocultar flechas, porque el type es text */}
        </div>
        <div className="flex-1">
          <label htmlFor="observacion" className="block text-gray-700 text-sm font-bold mb-2">
            Observaciones:
          </label>
          <textarea
            id="observacion"
            value={reporte.observacion || ''}
            onChange={(e) => onReporteChange('observacion', e.target.value)}
            placeholder="Falla u observación"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
    </div>
  );
};