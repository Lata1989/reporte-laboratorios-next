'use client';

import React from 'react';

interface DocenteInfoProps {
  onNombreChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  nombreDocente: string;
  laboratorio: string;
  onLaboratorioChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const DocenteInfo: React.FC<DocenteInfoProps> = ({
  onNombreChange,
  nombreDocente,
  laboratorio,
  onLaboratorioChange,
}) => {
  // Definimos el mapa de laboratorios (clave: identificador, valor: nombre)
  const laboratoriosMap = {
    lab1: 'Laboratorio pcs Trinitarios',
    lab2: 'Laboratorio pcs Leibnitz',
    lab3: 'Laboratorio pcs ciclo basico',
    // Puedes agregar más laboratorios aquí
  };

  // Convertimos el mapa de valores a un array para el select
  const laboratoriosArray = Object.values(laboratoriosMap);

  return (
    <div>
      <div>
        <label htmlFor="nombreDocente">Nombre del docente:</label>
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
          {laboratoriosArray.map((lab) => (
            <option key={lab} value={lab}>{lab}</option>
          ))}
        </select>
      </div>
    </div>
  );
};