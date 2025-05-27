import React from 'react';

interface Reporte {
  alumno?: string;
  observacion?: string;
}

interface Reportes {
  [key: string]: Reporte | undefined;
}

interface ReporteMaquinasProps {
  reportes: Reportes;
  onReporteChange: (maquinaId: string, campo: keyof Reporte, valor: string) => void;
}

export const ReporteMaquinas: React.FC<ReporteMaquinasProps> = ({ reportes, onReporteChange }) => {
  const numMaquinas = 36;
  const maquinas = Array.from({ length: numMaquinas }, (_, i) => i + 1);

  return (
    <div>
      <h2>Reporte de Máquinas</h2>
      <table>
        <thead>
          <tr>
            <th>Máquina</th>
            <th>Apellido del Alumno</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {maquinas.map((numero) => {
            const maquinaId = `maquina${numero}`;
            return (
              <tr key={numero}>
                <td>Máquina {numero}</td>
                <td>
                  <input
                    type="text"
                    value={reportes[maquinaId]?.alumno || ''}
                    onChange={(e) => onReporteChange(maquinaId, 'alumno', e.target.value)}
                    placeholder="Apellido"
                  />
                </td>
                <td>
                  <textarea
                    value={reportes[maquinaId]?.observacion || ''}
                    onChange={(e) => onReporteChange(maquinaId, 'observacion', e.target.value)}
                    placeholder="Falla u observación"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};