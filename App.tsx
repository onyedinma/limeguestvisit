import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from './android/app/src/auth/RegistrationScreen';
import LoginScreen from './android/app/src/auth/LoginScreen';
import HomeScreen from './android/app/src/auth/HomeScreen';
import SplashScreen from './android/app/src/auth/SplashScreen';
import CheckInScreen from './android/app/src/auth/CheckInScreen';
import CheckOutScreen from './android/app/src/auth/CheckOutScreen';
import ExportScreen from './android/app/src/auth/ExportScreen';
import HistoryScreen from './android/app/src/auth/HistoryScreen';
import ImportExportScreen from './android/app/src/auth/ImportExportScreen';
import VisitorViewScreen from './android/app/src/auth/VisitorViewScreen';


// Define stack types for navigation
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Registration: undefined;
  Home: undefined;
  CheckIn: undefined;
  CheckOut: undefined;
  Export: undefined;
  History: undefined;
  Backup: undefined;
  ViewScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CheckIn" component={CheckInScreen} />
        <Stack.Screen name="CheckOut" component={CheckOutScreen} />
        <Stack.Screen name="Export" component={ExportScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Backup" component={ImportExportScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ViewScreen" component={VisitorViewScreen} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
