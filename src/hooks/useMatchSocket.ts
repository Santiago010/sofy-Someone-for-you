import {useEffect, useRef} from 'react';
import {io, Socket} from 'socket.io-client';
import {MatchResponse} from '../interfaces/interfacesApp';
import {socketurl} from '../db/db';

interface UseMatchSocketReturn {
  socket: Socket | null;
}

export const useMatchSocket = (
  onMatchReceived: (matchData: MatchResponse) => void,
  idUserForMatch?: number,
): UseMatchSocketReturn => {
  const socketRef = useRef<Socket | null>(null);

  //   TODO:intento de conexion
  useEffect(() => {
    if (!idUserForMatch) {
      console.log('❌ No hay idUserForMatch, esperando...');
      return;
    }

    console.log(
      `🔄 Intentando conectar con idUserForMatch: ${idUserForMatch} con url: ${socketurl}`,
    );

    const socket = io(socketurl, {
      query: {individualId: idUserForMatch},
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(
        `✅ Conectado al WebSocket de matches con ID: ${idUserForMatch}`,
      );
      console.log(`🔗 Socket ID: ${socket.id}`);
    });

    socket.on('connect_error', error => {
      console.error('❌ Error al conectar al socket:', {
        message: error.message,
        url: socketurl,
        individualId: idUserForMatch,
      });
    });

    socket.on('disconnect', reason => {
      console.log(
        `❌ Desconectado del WebSocket de matches (ID: ${idUserForMatch})`,
      );
      console.log(`📋 disconnect Socket reason: ${reason}`);
    });

    socket.on('reconnect_attempt', attemptNumber => {
      console.log(`🔄 Intento de reconexión #${attemptNumber}`);
    });

    socket.on('reconnect_failed', () => {
      console.error('❌ Falló la reconexión después de varios intentos');
    });

    socket.on('match', (data: MatchResponse) => {
      console.log('🎉 ¡Match encontrado!', data);

      onMatchReceived(data);
    });

    socket.on('error', error => {
      console.error('❌ Error en el socket:', error);
    });

    return () => {
      console.log(`🔌 Limpiando conexión del socket (ID: ${idUserForMatch})`);
      socket.disconnect();
    };
  }, [idUserForMatch, onMatchReceived]);

  return {
    socket: socketRef.current,
  };
};
