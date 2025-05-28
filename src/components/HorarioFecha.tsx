import React, { useState, useEffect } from 'react';

interface HorarioFechaProps {
  horaDesde: string;
  onHoraDesdeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  horaHasta: string;
  onHoraHastaChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HorarioFecha: React.FC<HorarioFechaProps> = ({
  horaDesde: horaDesdeProp,
  onHoraDesdeChange,
  horaHasta: horaHastaProp,
  onHoraHastaChange,
}) => {
  const hoy = new Date().toLocaleDateString();
  const [horaDesdeLocal, setHoraDesdeLocal] = useState<string>('');
  const [horaHastaLocal, setHoraHastaLocal] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    if (!horaDesdeProp) {
      setHoraDesdeLocal(currentTime);
      onHoraDesdeChange({ target: { value: currentTime } } as React.ChangeEvent<HTMLInputElement>);
    }
    if (!horaHastaProp) {
      setHoraHastaLocal(currentTime);
      onHoraHastaChange({ target: { value: currentTime } } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [horaDesdeProp, horaHastaProp, onHoraDesdeChange, onHoraHastaChange]);

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <label htmlFor="horaDesde">Hora desde:</label>
        <input
          type="time"
          id="horaDesde"
          value={horaDesdeProp || horaDesdeLocal}
          onChange={onHoraDesdeChange}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label htmlFor="horaHasta">Hora hasta:</label>
        <input
          type="time"
          id="horaHasta"
          value={horaHastaProp || horaHastaLocal}
          onChange={onHoraHastaChange}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label>Fecha:</label>
        <input type="text" value={hoy} readOnly style={{ width: '100%' }} />
      </div>
    </div>
  );
};