import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Visitor type
interface Visitor {
  name: string;
  phone: string;
  room: string;
  gender: string;
  tagNumber: string;
  checkInDate: string;
  checkInTime: string;
}

const CheckOutScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const storedData = await AsyncStorage.getItem('visitors');
        const visitorData: Visitor[] = storedData ? JSON.parse(storedData) : [];
        setVisitors(visitorData);
        setFilteredVisitors(visitorData); // Initialize filtered list
      } catch (error) {
        Alert.alert('Error', 'Could not retrieve visitor data');
        console.error('Error fetching visitors:', error);
      }
    };

    fetchVisitors();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Filter visitors based on search query (by name, phone, or room number)
    const filtered = visitors.filter((visitor: Visitor) =>
      visitor.name.toLowerCase().includes(query.toLowerCase()) ||
      visitor.phone.includes(query) ||
      visitor.room.includes(query)
    );
    setFilteredVisitors(filtered);
  };

  const handleCheckOut = async (index: number) => {
    const visitor = visitors[index]; // Now TypeScript knows visitor is of type Visitor
    const checkOutDate = new Date().toISOString().split('T')[0];
    const checkOutTime = new Date().toLocaleTimeString();

    const visitorRecord = {
      name: visitor.name,
      phone: visitor.phone,
      room: visitor.room,
      gender: visitor.gender,
      tagNumber: visitor.tagNumber,
      checkInDate: visitor.checkInDate,
      checkInTime: visitor.checkInTime,
      checkOutDate,
      checkOutTime,
    };

    try {
      // Fetch current history
      const storedHistory = await AsyncStorage.getItem('visitorHistory');
      const historyData: any[] = storedHistory ? JSON.parse(storedHistory) : [];

      // Add the current visitor record to the history
      historyData.push(visitorRecord);

      // Save the updated history
      await AsyncStorage.setItem('visitorHistory', JSON.stringify(historyData));

      // Remove the checked-out visitor
      const updatedVisitors = [...visitors];
      updatedVisitors.splice(index, 1); // Remove the checked-out visitor

      // Update the visitors list
      await AsyncStorage.setItem('visitors', JSON.stringify(updatedVisitors));
      setVisitors(updatedVisitors); // Update the list
      setFilteredVisitors(updatedVisitors); // Update the filtered list
      Alert.alert('Success', 'Visitor checked out successfully');
    } catch (error) {
      Alert.alert('Error', 'Could not check out visitor');
      console.error('Error during check-out:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Check-Out</Text>

      <TextInput
        label="Search by Name, Phone, or Room"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.input}
      />

      {filteredVisitors.length > 0 ? (
        filteredVisitors.map((visitor: Visitor, index: number) => (
          <List.Item
            key={index}
            title={visitor.name}
            description={`Phone: ${visitor.phone}, Room: ${visitor.room}, Check-In: ${visitor.checkInDate} ${visitor.checkInTime}`}
            right={() => (
              <Button mode="outlined" onPress={() => handleCheckOut(index)}>
                Check Out
              </Button>
            )}
          />
        ))
      ) : (
        <Text style={styles.noResultsText}>No visitors found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default CheckOutScreen;
