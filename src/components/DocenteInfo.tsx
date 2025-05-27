import React from 'react';

interface DocenteInfoProps {
  onNombreChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  nombreDocente: string;
  laboratorio: string;
  onLaboratorioChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  laboratorios: string[];
}

export const DocenteInfo: React.FC<DocenteInfoProps> = ({
  onNombreChange,
  nombreDocente,
  laboratorio,
  onLaboratorioChange,
  laboratorios,
}) => {
  return (
    <div>
      <div>
        <label htmlFor="nombreDocente">Nombre del Docente:</label>
        <input
          type="text"
          id="nombreDocente"
          value={nombreDocente}
          onChange={onNombreChange}
        />
      </div>
      <div>
        <label htmlFor="laboratorio">Laboratorio:</label>
        <select id="laboratorio" value={laboratorio} onChange={onLaboratorioChange}>
          <option value="">Seleccionar laboratorio</option>
          {laboratorios.map((lab) => (
            <option key={lab} value={lab}>{lab}</option>
          ))}
        </select>
      </div>
    </div>
  );
};