import '../tamagui-web.css'

import {  Stack } from 'expo-router';
import { NavigationContainer, DarkTheme, DefaultTheme, ThemeProvider  } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet, useColorScheme } from 'react-native'

import { TamaguiProvider } from 'tamagui';

import { tamaguiConfig } from '../tamagui.config'


export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <NavigationContainer>
          <GestureHandlerRootView style={styles.root}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" redirect={true} />
              <Stack.Screen name="welcome" />
              <Stack.Screen name="media" />
              <Stack.Screen name="summary" />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </GestureHandlerRootView>
        </NavigationContainer>
      </ThemeProvider>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
