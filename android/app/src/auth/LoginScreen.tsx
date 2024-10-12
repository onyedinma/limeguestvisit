import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@app/App'; // Adjust the import according to your project structure

// Define the type for the navigation prop
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    if (username.length === 0 || password.length === 0) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    try {
      const userData = await AsyncStorage.getItem(username);
      if (userData) {
        const { password: storedPassword } = JSON.parse(userData);
        if (storedPassword === password) {
          Alert.alert('Success', 'Login successful');
          navigation.navigate('Home');
          // Navigate to the next screen after successful login
        } else {
          Alert.alert('Error', 'Incorrect password');
        }
      } else {
        Alert.alert('Error', 'User does not exist');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        mode="outlined"
        left={
          <TextInput.Icon
            icon={() => (
              <MaterialIcons name="person" size={20} color="green" /> // Set icon color to green
            )}
          />
        }
        theme={{ colors: { primary: 'green' } }} // Set primary theme color to green
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        mode="outlined"
        secureTextEntry
        left={
          <TextInput.Icon
            icon={() => (
              <MaterialIcons name="lock" size={20} color="green" /> // Set icon color to green
            )}
          />
        }
        theme={{ colors: { primary: 'green' } }} // Set primary theme color to green
      />

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>

      <Text style={styles.link} onPress={() => navigation.navigate('Registration')}>
        Don't have an account? Register
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    marginBottom: 20,
    textAlign: 'center',
    color: 'green',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff', // Keep the input background white
    color: 'black', // Text color in the input field
  },
  button: {
    marginTop: 16,
    backgroundColor: 'green', // Button background color
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: 'blue',
  },
});

export default LoginScreen;
