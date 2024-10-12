import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Visitor interface
interface Visitor {
  name: string;
  phone: string;
  room: string;
  gender: string;
  tag: string;
  checkInDate: string;
  checkInTime: string;
}

const VisitorViewScreen = () => {
  // Specify the state type as an array of Visitor
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const storedData = await AsyncStorage.getItem('visitors');
        const visitorsData: Visitor[] = storedData ? JSON.parse(storedData) : [];
        setVisitors(visitorsData);
      } catch (error) {
        console.error('Error fetching visitors:', error);
      }
    };

    fetchVisitors();
  }, []);

  const getRoomVisitorCount = () => {
    const roomCounts: { [key: string]: number } = {}; // Define roomCounts as an object with string keys and number values
    
    visitors.forEach(visitor => {
      const room = visitor.room;
      if (roomCounts[room]) {
        roomCounts[room]++;
      } else {
        roomCounts[room] = 1;
      }
    });
    
    return roomCounts;
  };

  const roomVisitorCounts = getRoomVisitorCount();

  const renderRoomItem = ({ item }: { item: string }) => {
    const count = roomVisitorCounts[item];
    return (
      <View key={item} style={styles.roomContainer}>
        <Text style={styles.roomText}>{item}</Text>
        <View style={[styles.indicator, count > 3 ? styles.indicatorRed : styles.indicatorGreen]}>
          <Text style={styles.indicatorText}>{count}</Text>
        </View>
      </View>
    );
  };

  const roomNumbers = Object.keys(roomVisitorCounts);

  // Function to chunk the room numbers array into rows of 4
  const chunkArray = (arr: string[], chunkSize: number) => {
    const result: string[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };

  const chunkedRoomNumbers = chunkArray(roomNumbers, 4);


  const renderRowItem = ({ item }: { item: string[] }) => {
    return (
      <View key={item.join('-')} style={styles.rowContainer}>
        {item.map(room => renderRoomItem({ item: room }))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checked-In Visitors</Text>
      <FlatList
        data={chunkedRoomNumbers}
        renderItem={renderRowItem}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#81B304', // Background color
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  roomContainer: {
    flex: 1, // Ensure each room takes up equal space
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 5,
  },
  roomText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold"
  },

  indicator: {
    width: 25,
    height: 25,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorRed: {
    backgroundColor: 'red',
  },
  indicatorGreen: {
    backgroundColor: 'green',
  },
  indicatorText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default VisitorViewScreen;