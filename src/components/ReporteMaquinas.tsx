import React from 'react';

interface ReporteProps {
  alumno?: string;
  observacion?: string;
}

interface ReporteMaquinasProps {
  reporte: ReporteProps;
  onReporteChange: (campo: keyof ReporteProps, valor: string) => void;
}

export const ReporteMaquinas: React.FC<ReporteMaquinasProps> = ({ reporte, onReporteChange }) => {
  return (
    <div>
      <h2>Reporte de la máquina</h2>
      <table>
        <thead>
          <tr>
            <th>Apellido del estudiante</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                value={reporte.alumno || ''}
                onChange={(e) => onReporteChange('alumno', e.target.value)}
                placeholder="Si son grupo poner todos los apellidos"
              />
            </td>
            <td>
              <textarea
                value={reporte.observacion || ''}
                onChange={(e) => onReporteChange('observacion', e.target.value)}
                placeholder="Falla u observación"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};