import React from 'react';

interface FooterProps {
  developerName: string;
}

export const Footer: React.FC<FooterProps> = ({ developerName }) => {
  return (
    <footer style={{ marginTop: '30px', textAlign: 'center', color: '#777', padding: '10px', borderTop: '1px solid #eee' }}>
      Desarrollado por {developerName}
    </footer>
  );
};