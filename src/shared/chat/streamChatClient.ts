import { StreamChat } from 'stream-chat';

let client: StreamChat | null = null;
let connectedUserId: string | null = null;

export function getStreamChatClient(apiKey: string): StreamChat {
  if (!client) {
    client = StreamChat.getInstance(apiKey);
  }
  return client;
}

/**
 * Connects the given user to Stream Chat. No-ops if already connected as
 * that user (cheap to call from multiple screens).
 */
export async function connectChatUser({
  apiKey,
  token,
  userId,
  userName,
}: {
  apiKey: string;
  token: string;
  userId: string;
  userName: string;
}): Promise<StreamChat> {
  const chatClient = getStreamChatClient(apiKey);
  if (connectedUserId === userId) {
    return chatClient;
  }
  if (connectedUserId) {
    await chatClient.disconnectUser();
    connectedUserId = null;
  }
  await chatClient.connectUser({ id: userId, name: userName }, token);
  connectedUserId = userId;
  return chatClient;
}
