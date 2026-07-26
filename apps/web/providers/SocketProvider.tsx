"use client";

import * as React from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = React.createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    const socketInstance = io({
      path: "/api/socket/io",
      addTrailingSlash: false,
      autoConnect: false,
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  return context;
};
