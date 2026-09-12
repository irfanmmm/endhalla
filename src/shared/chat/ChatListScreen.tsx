import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Channel } from 'stream-chat';
import { connectChatUser } from './streamChatClient';

interface ChatTokenData {
  apiKey: string;
  token: string;
  userId: string;
  userName: string;
}

interface ChatListScreenProps {
  chatToken?: ChatTokenData;
  navigation: any;
}

function getOtherMember(channel: Channel, myUserId: string) {
  const members = Object.values(channel.state.members || {});
  const other = members.find((m) => m.user?.id !== myUserId);
  return other?.user;
}

export default function ChatListScreen({ chatToken, navigation }: ChatListScreenProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChannels = useCallback(async () => {
    if (!chatToken) return;
    setLoading(true);
    try {
      const client = await connectChatUser(chatToken);
      const result = await client.queryChannels(
        { type: 'messaging', members: { $in: [chatToken.userId] } },
        [{ last_message_at: -1 }],
      );
      setChannels(result);
    } catch (err) {
      console.error('Failed to load chat channels:', err);
    } finally {
      setLoading(false);
    }
  }, [chatToken]);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  if (!chatToken || loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color="#0F9D8C" />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <Text style={styles.title}>Messages</Text>
        <FlatList
          data={channels}
          keyExtractor={(item) => item.cid}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadChannels}
          ListEmptyComponent={<Text style={styles.emptyText}>No conversations yet.</Text>}
          renderItem={({ item }) => {
            const other = getOtherMember(item, chatToken.userId);
            const lastMessage = item.state.messages[item.state.messages.length - 1];
            return (
              <TouchableOpacity
                style={styles.row}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('ChatScreen', {
                    channelId: item.id,
                    chatToken,
                    otherUserName: other?.name || 'Conversation',
                  })
                }
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{(other?.name || '?').charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{other?.name || 'Conversation'}</Text>
                  <Text style={styles.preview} numberOfLines={1}>
                    {lastMessage?.text || 'Say hello 👋'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F8F5' },
  centered: { flex: 1, backgroundColor: '#F9F8F5', alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  list: { paddingHorizontal: 20, paddingBottom: 30 },
  emptyText: { color: '#7A7870', textAlign: 'center', marginTop: 40 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E2DB',
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCEFEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontWeight: '700', color: '#0F9D8C', fontSize: 16 },
  name: { fontWeight: '700', fontSize: 15, color: '#1A1A1A', marginBottom: 2 },
  preview: { fontSize: 13, color: '#7A7870' },
});
