import React from 'react';
import { useGetChatTokenQuery } from '../../../shared/store/api/clientApi';
import ChatListScreen from '../../../shared/chat/ChatListScreen';

export default function MessagesScreen({ navigation }: any) {
  const { data } = useGetChatTokenQuery();
  return <ChatListScreen chatToken={data} navigation={navigation} />;
}
