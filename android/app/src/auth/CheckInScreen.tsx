import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Provider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CheckInScreen = () => {
  const [visitorName, setVisitorName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [gender, setGender] = useState('Male'); // Default gender selection
  const [checkInDate, setCheckInDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('');

  // Focus states for each input
  const [nameFocus, setNameFocus] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);
  const [roomFocus, setRoomFocus] = useState(false);
  const [tagFocus, setTagFocus] = useState(false);

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedTime = now.toTimeString().split(' ')[0].slice(0, 5); // HH:MM

    setCheckInDate(formattedDate);
    setCheckInTime(formattedTime);
  }, []);

  const handleCheckIn = async () => {
    if (!visitorName || !phoneNumber || !roomNumber || !gender || !tagNumber) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    const visitorData = {
      name: visitorName,
      phone: phoneNumber,
      room: roomNumber,
      gender,
      tag: tagNumber,
      checkInDate,
      checkInTime,
    };

    try {
      const storedData = await AsyncStorage.getItem('visitors');
      const visitors = storedData ? JSON.parse(storedData) : [];
      visitors.push(visitorData);

      await AsyncStorage.setItem('visitors', JSON.stringify(visitors));
      console.log("Current Visitors in AsyncStorage:", visitors); // Log visitors
      Alert.alert('Success', 'Visitor checked in successfully!');
      // Clear fields after success
      setVisitorName('');
      setPhoneNumber('');
      setRoomNumber('');
      setTagNumber('');
      setGender('Male'); // Reset gender selection
      // Reset to today's date and current time
      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const formattedTime = now.toTimeString().split(' ')[0].slice(0, 5); // HH:MM
      setCheckInDate(formattedDate);
      setCheckInTime(formattedTime);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while checking in');
      console.error('Error checking in visitor:', error);
    }
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Visitor Check-in</Text>

        <TextInput
          label="Visitor Name"
          value={visitorName}
          onChangeText={setVisitorName}
          style={styles.input}
          theme={{
            colors: {
              primary: 'white', // Change primary color to white for input underline
           
            },
          }}
          onFocus={() => setNameFocus(true)} // Set focus state to true
          onBlur={() => setNameFocus(false)} // Reset focus state to false
          left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={20} color="white" />} />} // Person icon
        />

        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          keyboardType="phone-pad"
          theme={{
            colors: {
              primary: 'white', // Change primary color to white for input underline
            },
          }}
          onFocus={() => setPhoneFocus(true)} // Set focus state to true
          onBlur={() => setPhoneFocus(false)} // Reset focus state to false
          left={<TextInput.Icon icon={() => <MaterialIcons name="phone" size={20} color="white" />} />} // Phone icon
        />

        <TextInput
          label="Room Number"
          value={roomNumber}
          onChangeText={setRoomNumber}
          style={styles.input}
          keyboardType="number-pad"
          theme={{
            colors: {
              primary: 'white', // Change primary color to white for input underline
            },
          }}
          onFocus={() => setRoomFocus(true)} // Set focus state to true
          onBlur={() => setRoomFocus(false)} // Reset focus state to false
          left={<TextInput.Icon icon={() => <MaterialIcons name="room" size={20} color="white" />} />} // Room icon
        />

        <TextInput
          label="Visitor Tag Number"
          value={tagNumber}
          onChangeText={setTagNumber}
          style={styles.input}
          theme={{
            colors: {
              primary: 'white', // Change primary color to white for input underline
             
            },
          }}
          onFocus={() => setTagFocus(true)} // Set focus state to true
          onBlur={() => setTagFocus(false)} // Reset focus state to false
          left={<TextInput.Icon icon={() => <MaterialIcons name="tag" size={20} color="white" />} />} // Tag icon
        />

        <TextInput
          label="Check-In Date"
          value={checkInDate}
          editable={false}
          style={styles.input}
          theme={{
            colors: {
              primary: 'white', // Change primary color to white for input underline
            },
          }}
          left={<TextInput.Icon icon={() => <MaterialIcons name="date-range" size={20} color="white" />} />} // Date icon
        />

        <TextInput
          label="Check-In Time"
          value={checkInTime}
          editable={false}
          style={styles.input}
          theme={{
            colors: {
              primary: 'white', // Change primary color to white for input underline
          
            },
          }}
          left={<TextInput.Icon icon={() => <MaterialIcons name="access-time" size={20} color="white" />} />} // Time icon
        />

        {/* Gender Radio Buttons Rendered Horizontally */}
        <View style={styles.radioContainer}>
          <Text style={styles.radioTitle}>Select Gender</Text>
          <RadioButton.Group
            onValueChange={(newValue) => setGender(newValue)}
            value={gender}
          >
            <View style={styles.radioButtonRow}>
              <View style={styles.radioButtonContainer}>
                <RadioButton value="Male" color="white" />
                <Text style={styles.radioLabel}>Male</Text>
              </View>
              <View style={styles.radioButtonContainer}>
                <RadioButton value="Female" color="white" />
                <Text style={styles.radioLabel}>Female</Text>
              </View>
              <View style={styles.radioButtonContainer}>
                <RadioButton value="Others" color="white" />
                <Text style={styles.radioLabel}>Others</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>

        <Button
          mode="contained"
          onPress={handleCheckIn}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Check In
        </Button>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#2f4709', // Green background for the container
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white', // White color for the title
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent', // Transparent background for input fields
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white', // White color for the radio title
  },
  radioButtonRow: {
    flexDirection: 'row', // Make the radio buttons appear horizontally
    justifyContent: 'space-between', // Space the radio buttons evenly
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: 16,
    color: 'white', // White color for the radio label
    marginLeft: 4,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#fff', // Green button background
    borderRadius: 10,
    padding: 10,
  },
  buttonLabel: {
    color: '#2f4709', // Set the button text color to white
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default CheckInScreen;
