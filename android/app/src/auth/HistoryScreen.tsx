import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, List, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Visitor History type
interface VisitorHistory {
  name: string;
  phone: string;
  room: string;
  tagNumber: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
}

const HistoryScreen = () => {
  const [visitorHistory, setVisitorHistory] = useState<VisitorHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<VisitorHistory[]>([]);
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('visitorHistory');
        const historyData: VisitorHistory[] = storedHistory ? JSON.parse(storedHistory) : [];
        setVisitorHistory(historyData);
        setFilteredHistory(historyData); // Initialize filtered list
      } catch (error) {
        Alert.alert('Error', 'Could not retrieve visitor history');
        console.error('Error fetching visitor history:', error);
      }
    };

    fetchHistory();
  }, []);

  const handleSearchByDate = (date: string) => {
    setSearchDate(date);

    // Filter visitor history based on search date
    const filtered = visitorHistory.filter((visitor) => 
      visitor.checkOutDate === date || visitor.checkInDate === date
    );
    setFilteredHistory(filtered);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Visitor History</Text>

      <TextInput
        label="Search by Date (YYYY-MM-DD)"
        value={searchDate}
        onChangeText={handleSearchByDate}
        style={styles.input}
        keyboardType="numeric"
      />

      {filteredHistory.length > 0 ? (
        filteredHistory.map((visitor, index) => (
          <List.Item
            key={index}
            title={visitor.name}
            description={`Phone: ${visitor.phone}, Room: ${visitor.room}, Tag Number: ${visitor.tagNumber}, Check-In: ${visitor.checkInDate} ${visitor.checkInTime}, Check-Out: ${visitor.checkOutDate} ${visitor.checkOutTime}`}
          />
        ))
      ) : (
        <Text style={styles.noResultsText}>No visitor history found for this date</Text>
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

export default HistoryScreen;
