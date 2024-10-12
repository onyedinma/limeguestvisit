import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import DocumentPicker from 'react-native-document-picker';

const ImportExportScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Function to export the database
  const exportDatabase = async () => {
    setLoading(true);
    try {
      const storedData = await AsyncStorage.getItem('visitorHistory');
      const fileName = 'visitor_database_backup.json';
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      if (storedData) {
        await RNFS.writeFile(filePath, storedData, 'utf8');
        await Share.open({
          title: 'Export Database',
          url: `file://${filePath}`,
          type: 'application/json',
        });
        Alert.alert('Success', 'Database exported successfully');
      } else {
        Alert.alert('No Data', 'No data found to export.');
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'There was an error exporting the database.');
    } finally {
      setLoading(false);
    }
  };

  // Function to import the database
  const importDatabase = async () => {
    setLoading(true);
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      if (result && result[0]) {
        const filePath = result[0].uri;
        const fileContent = await RNFS.readFile(filePath, 'utf8');
        await AsyncStorage.setItem('visitorHistory', fileContent);
        Alert.alert('Success', 'Database imported successfully.');
      } else {
        Alert.alert('No File', 'No file selected for import.');
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Import error:', error);
        Alert.alert('Error', 'There was an error importing the database.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <Text style={styles.title}>Backup & Restore Database</Text>

          <Button
            mode="contained"
            onPress={exportDatabase}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Export Database
          </Button>

          <Button
            mode="contained"
            onPress={importDatabase}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Import Database
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
  button: {
    marginVertical: 10,
    width: '100%',
  },
});

export default ImportExportScreen;
