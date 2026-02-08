import { WebSocketServer, WebSocket } from 'ws';
import { logger } from "../utils/logger.mjs";

const clients = new Map();
const rooms = new Map();
const messageRateLimits = new Map();

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_MESSAGES = 30; // max messages per window
const MAX_MESSAGE_LENGTH = 500;

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    logger.info('[WebSocket] New connection');
    
    messageRateLimits.set(ws, { count: 0, windowStart: Date.now() });

    ws.on('message', (data) => {
      try {
        if (!checkRateLimit(ws)) {
          ws.send(JSON.stringify({
            type: 'error',
            content: 'Rate limit exceeded. Please slow down.'
          }));
          return;
        }
        
        const rawMessage = data.toString();
        if (rawMessage.length > MAX_MESSAGE_LENGTH * 2) {
          ws.send(JSON.stringify({
            type: 'error',
            content: 'Message too long'
          }));
          return;
        }
        
        const message = JSON.parse(rawMessage);
        handleMessage(ws, message);
      } catch (error) {
        logger.error('[WebSocket] Error parsing message', { error: error?.message || error });
        ws.send(JSON.stringify({ 
          type: 'error', 
          content: 'Invalid message format' 
        }));
      }
    });

    ws.on('close', () => {
      handleDisconnect(ws);
    });

    ws.on('error', (error) => {
      logger.error('[WebSocket] Error', { error: error?.message || error });
      handleDisconnect(ws);
    });
  });

  logger.info('[WebSocket] Server initialized on path /ws');
  return wss;
}

function handleMessage(ws, message) {
  switch (message.type) {
    case 'join':
      handleJoin(ws, message.username || 'Anonymous', message.room || 'general');
      break;
    case 'chat':
      handleChat(ws, message.content || '');
      break;
    case 'leave':
      handleDisconnect(ws);
      break;
    default:
      ws.send(JSON.stringify({ 
        type: 'error', 
        content: 'Unknown message type' 
      }));
  }
}

function handleJoin(ws, username, room) {
  const client = {
    ws,
    username: sanitizeUsername(username),
    room,
    joinedAt: Date.now(),
  };
  
  clients.set(ws, client);
  
  if (!rooms.has(room)) {
    rooms.set(room, new Set());
  }
  rooms.get(room).add(ws);
  
  ws.send(JSON.stringify({
    type: 'system',
    content: `Welcome to the ${room} community space, ${client.username}! Remember to be kind and supportive.`,
    timestamp: Date.now(),
  }));
  
  broadcastToRoom(room, {
    type: 'presence',
    content: `${client.username} joined the conversation`,
    username: 'System',
    timestamp: Date.now(),
    room,
  }, ws);
  
  sendRoomPresence(room);
}

function handleChat(ws, content) {
  const client = clients.get(ws);
  if (!client) {
    ws.send(JSON.stringify({ 
      type: 'error', 
      content: 'Please join a room first' 
    }));
    return;
  }
  
  const sanitizedContent = sanitizeMessage(content);
  if (!sanitizedContent) return;
  
  const message = {
    type: 'chat',
    content: sanitizedContent,
    username: client.username,
    timestamp: Date.now(),
    room: client.room,
  };
  
  broadcastToRoom(client.room, message);
}

function handleDisconnect(ws) {
  const client = clients.get(ws);
  if (client) {
    const room = rooms.get(client.room);
    if (room) {
      room.delete(ws);
      if (room.size === 0) {
        rooms.delete(client.room);
      } else {
        broadcastToRoom(client.room, {
          type: 'presence',
          content: `${client.username} left the conversation`,
          username: 'System',
          timestamp: Date.now(),
          room: client.room,
        });
        sendRoomPresence(client.room);
      }
    }
    clients.delete(ws);
  }
  messageRateLimits.delete(ws);
}

function checkRateLimit(ws) {
  const limit = messageRateLimits.get(ws);
  if (!limit) return false;
  
  const now = Date.now();
  if (now - limit.windowStart > RATE_LIMIT_WINDOW) {
    limit.count = 1;
    limit.windowStart = now;
    return true;
  }
  
  limit.count++;
  if (limit.count > RATE_LIMIT_MAX_MESSAGES) {
    return false;
  }
  
  return true;
}

function broadcastToRoom(room, message, exclude) {
  const roomClients = rooms.get(room);
  if (!roomClients) return;
  
  const messageStr = JSON.stringify(message);
  const clientsArray = Array.from(roomClients);
  
  for (const client of clientsArray) {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  }
}

function sendRoomPresence(room) {
  const roomClients = rooms.get(room);
  if (!roomClients) return;
  
  const clientsArray = Array.from(roomClients);
  const users = [];
  for (const ws of clientsArray) {
    const client = clients.get(ws);
    if (client) {
      users.push(client.username);
    }
  }
  
  const presenceMessage = JSON.stringify({
    type: 'presence_list',
    users,
    count: users.length,
    room,
    timestamp: Date.now(),
  });
  
  for (const client of clientsArray) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(presenceMessage);
    }
  }
}

function sanitizeUsername(username) {
  return username
    .replace(/[<>&"']/g, '')
    .slice(0, 30)
    .trim() || 'Anonymous';
}

function sanitizeMessage(content) {
  const cleaned = content
    .replace(/[<>&]/g, (char) => ({
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
    }[char] || char))
    .slice(0, 500)
    .trim();
  
  return cleaned;
}

export function getWebSocketStats() {
  const roomStats = Array.from(rooms.entries()).map(([name, clients]) => ({
    name,
    userCount: clients.size,
  }));
  
  return {
    totalConnections: clients.size,
    rooms: roomStats,
  };
}
