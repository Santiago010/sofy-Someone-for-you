import {useEffect, useRef} from 'react';
import {io, Socket} from 'socket.io-client';
import {baseURL} from '../db/db';

export const useMatchSocket = (
  idUserForChats?: string,
  onMatch?: (data: any) => void,
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!idUserForChats) return;

    const socket = io(`${baseURL}/matches`, {
      query: {individualId: `${idUserForChats}`},
    });
    socketRef.current = socket;

    socket.on('match', data => {
      console.log('¡Match!', data.matchedWith);
      if (onMatch) onMatch(data);
      // Aquí podrías disparar una notificación/modal si lo deseas
    });

    return () => {
      socket.disconnect();
    };
  }, [idUserForChats, onMatch]);
};
