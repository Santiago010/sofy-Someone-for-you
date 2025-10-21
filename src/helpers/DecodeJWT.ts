import {decode as atob, encode as btoa} from 'base-64';

// Función para decodificar el payload del JWT
export const decodeJWT = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT inválido: formato incorrecto');
    }

    const payload = parts[1];
    // Agregar padding si es necesario
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload =
      normalizedPayload + '='.repeat((4 - (normalizedPayload.length % 4)) % 4);

    const decodedPayload = atob(paddedPayload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
};
