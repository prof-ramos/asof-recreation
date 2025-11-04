'use client';

import { useEffect } from 'react';

export default function RegisterServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('ServiceWorker registrado com sucesso:', registration.scope);
          })
          .catch((error) => {
            console.log('Falha no registro do ServiceWorker:', error);
          });
      });
    }
  }, []);

  return null; // This component doesn't render anything
}