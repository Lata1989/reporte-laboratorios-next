import React from 'react';

interface HorarioFechaProps {
  horaDesde: string;
  onHoraDesdeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  horaHasta: string;
  onHoraHastaChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HorarioFecha: React.FC<HorarioFechaProps> = ({
  horaDesde,
  onHoraDesdeChange,
  horaHasta,
  onHoraHastaChange,
}) => {
  const hoy = new Date().toLocaleDateString();

  return (
    <div>
      <div>
        <label htmlFor="horaDesde">Hora Desde:</label>
        <input
          type="time"
          id="horaDesde"
          value={horaDesde}
          onChange={onHoraDesdeChange}
        />
      </div>
      <div>
        <label htmlFor="horaHasta">Hora Hasta:</label>
        <input
          type="time"
          id="horaHasta"
          value={horaHasta}
          onChange={onHoraHastaChange}
        />
      </div>
      <div>
        <label>Fecha:</label>
        <input type="text" value={hoy} readOnly />
      </div>
    </div>
  );
};