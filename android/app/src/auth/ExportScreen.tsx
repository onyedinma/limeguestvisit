import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, List, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app/App';

// Define the Visitor type
interface Visitor {
  name: string;
  phone: string;
  room: string;
  gender: string;
  tagNumber: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
}

type ExportScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Export'>;
};

const ExportScreen: React.FC<ExportScreenProps> = ({ navigation }) => {
  const [visitorHistory, setVisitorHistory] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');

  useEffect(() => {
    const fetchVisitorHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('visitorHistory');
        const historyData: Visitor[] = storedHistory ? JSON.parse(storedHistory) : [];
        setVisitorHistory(historyData);
        setFilteredVisitors(historyData); // Initialize filtered list
      } catch (error) {
        Alert.alert('Error', 'Could not retrieve visitor history');
        console.error('Error fetching visitor history:', error);
      }
    };

    fetchVisitorHistory();
  }, []);

  const handleDateChange = (type: 'start' | 'end', event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    if (type === 'start') {
      setShowStartPicker(false);
      setStartDate(currentDate);
      setStartDateInput(currentDate.toISOString().split('T')[0]);
    } else {
      setShowEndPicker(false);
      setEndDate(currentDate);
      setEndDateInput(currentDate.toISOString().split('T')[0]);
    }

    // Filter visitors when dates change
    if (startDateInput && endDateInput) {
      const filtered = filterVisitorsByInterval(visitorHistory);
      setFilteredVisitors(filtered);
    }
  };

  const filterVisitorsByInterval = (allVisitors: Visitor[]): Visitor[] => {
    return allVisitors.filter((visitor) => {
      const visitorCheckInDate = new Date(visitor.checkInDate).getTime();
      return (
        visitorCheckInDate >= new Date(startDateInput).getTime() &&
        visitorCheckInDate <= new Date(endDateInput).getTime()
      );
    });
  };

  const generateCSV = (filteredVisitors: Visitor[]) => {
    const header = ['Name', 'Phone', 'Room', 'Gender', 'Tag Number', 'Check-In Date', 'Check-In Time', 'Check-Out Date', 'Check-Out Time'];
    const rows = filteredVisitors.map((visitor) => [
      visitor.name,
      visitor.phone,
      visitor.room,
      visitor.gender,
      visitor.tagNumber,
      visitor.checkInDate,
      visitor.checkInTime,
      visitor.checkOutDate,
      visitor.checkOutTime,
    ]);

    const csvContent = [header, ...rows].map((e) => e.join(',')).join('\n');
    return csvContent;
  };

  const exportFile = async () => {
    if (filteredVisitors.length === 0) {
      Alert.alert('No data', 'No visitors found for the selected date range');
      return;
    }
  
    const fileContent = generateCSV(filteredVisitors);
    const fileName = 'visitors_export.csv';
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
  
    try {
      await RNFS.writeFile(filePath, fileContent, 'utf8');
      await Share.open({
        title: 'Export Visitors',
        url: `file://${filePath}`,
        type: 'text/csv',
      });
      Alert.alert('Success', 'File exported successfully');
    } catch (error) {
      // Cast error to `Error` to properly access the message
      if (error instanceof Error && error.message !== 'User did not share') {
        // Log the error if it's not due to the user canceling the share action
        console.error('Error exporting file:', error);
        Alert.alert('Error', 'There was a problem exporting the file.');
      }
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <Text style={styles.title}>Export Visitors</Text>

          <View style={styles.datePickerContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.label}>Start Date:</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={startDateInput}
                onChangeText={setStartDateInput}
              />
              <Button
                mode="contained"
                onPress={() => setShowStartPicker(true)}
                style={styles.dateButton}
                icon={() => <MaterialIcons name="event" size={20} color="white" />}
              >
                Select Start Date
              </Button>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => handleDateChange('start', event, selectedDate)}
                />
              )}
            </View>

            <View style={styles.dateContainer}>
              <Text style={styles.label}>End Date:</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={endDateInput}
                onChangeText={setEndDateInput}
              />
              <Button
                mode="contained"
                onPress={() => setShowEndPicker(true)}
                style={styles.dateButton}
                icon={() => <MaterialIcons name="event" size={20} color="white" />}
              >
                Select End Date
              </Button>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => handleDateChange('end', event, selectedDate)}
                />
              )}
            </View>
          </View>

          {/* Display filtered results with a scrollable view */}
          {/* <ScrollView style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Filtered Results:</Text>
            {filteredVisitors.length > 0 ? (
              filteredVisitors.map((visitor, index) => (
                <List.Item
                  key={index}
                  title={visitor.name}
                  description={`Phone: ${visitor.phone}, Room: ${visitor.room}, Gender: ${visitor.gender}, Tag Number: ${visitor.tagNumber}, Check-In: ${visitor.checkInDate} ${visitor.checkInTime}, Check-Out: ${visitor.checkOutDate} ${visitor.checkOutTime}`}
                />
              ))
            ) : (
              <Text>No visitors found for the selected date range.</Text>
            )}
          </ScrollView> */}

          <Button
            mode="contained"
            onPress={exportFile}
            style={styles.exportButton}
          >
            Export to CSV
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Home')}
            style={styles.backButton}
            icon={() => <MaterialIcons name="arrow-back" size={20} color="#4CAF50" />}
          >
            Back to Home
          </Button>
        </ScrollView>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    padding: 20,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  dateContainer: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  resultsContainer: {
    marginVertical: 20,
    width: '100%',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exportButton: {
    marginVertical: 10,
  },
  backButton: {
    borderColor: '#4CAF50',
    width: '100%',
    marginTop: 10,
  },
  dateButton: {
    marginTop: 5,
  },
});

export default ExportScreen;
