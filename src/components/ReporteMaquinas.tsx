import React from 'react';

interface ReporteProps {
  alumno?: string;
  observacion?: string;
  numeroMaquina?: string; // Nuevo campo
}

interface ReporteMaquinasProps {
  reporte: ReporteProps;
  onReporteChange: (campo: keyof ReporteProps, valor: string) => void;
}

export const ReporteMaquinas: React.FC<ReporteMaquinasProps> = ({ reporte, onReporteChange }) => {
  // Aplicamos una altura fija a todos los inputs y textarea para consistencia
  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-10";

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Reporte de la máquina</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 shadow-md rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Apellido del estudiante</th>
              <th className="py-2 px-4 border-b text-left">Número de máquina</th>
              <th className="py-2 px-4 border-b text-left">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  value={reporte.alumno || ''}
                  onChange={(e) => onReporteChange('alumno', e.target.value)}
                  placeholder="Si son grupo poner todos los apellidos"
                  className={inputClasses}
                />
              </td>

              <td className="py-2 px-4 border-b">
                <input
                  type="number"
                  value={reporte.numeroMaquina || ''}
                  onChange={(e) => onReporteChange('numeroMaquina', e.target.value)}
                  placeholder="Número de máquina"
                  className={inputClasses}
                />
                {/* Estilos para ocultar las flechas de control del input de tipo number */}
                <style jsx>{`
                  input[type=number]::-webkit-inner-spin-button,
                  input[type=number]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                  }
                  input[type=number] {
                    -moz-appearance: textfield; /* Para Firefox */
                  }
                `}</style>
              </td>

              <td className="py-2 px-4 border-b">
                <textarea
                  value={reporte.observacion || ''}
                  onChange={(e) => onReporteChange('observacion', e.target.value)}
                  placeholder="Falla u observación"
                  className={inputClasses}
                  rows={1}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};