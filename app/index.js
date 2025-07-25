import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Only import notifications on native platforms (not web)
let Notifications;
if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '679259319267-3vajt7r6l2cf1ukegh0l5gh3kp15sns8.apps.googleusercontent.com',
    androidClientId: '679259319267-rtb5ag3hrad5p3leh2fs93tmcb90thbv.apps.googleusercontent.com',
    iosClientId: '679259319267-68da5uuols31p7gffdftnuueg0m10cub.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      getUserInfo(response.authentication.accessToken);
    }
  }, [response]);

  const getUserInfo = async (token) => {
    let res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = await res.json();
    setUserInfo(user);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    router.replace('/home');
  };

  useEffect(() => {
    if (Platform.OS !== 'web' && Notifications) {
      const requestPermissions = async () => {
        await Notifications.requestPermissionsAsync();
      };
      requestPermissions();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      {userInfo ? (
        <View>
          <Image source={{ uri: userInfo.picture }} style={styles.image} />
          <Text>Welcome, {userInfo.name}</Text>
        </View>
      ) : (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => promptAsync()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  image: { width: 100, height: 100, borderRadius: 50, marginVertical: 20 },
});
