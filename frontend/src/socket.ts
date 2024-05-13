import { io } from "socket.io-client";

const URL = "https://jive-backend.onrender.com";

export const socket = io(URL, { autoConnect: false });
