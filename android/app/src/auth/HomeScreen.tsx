import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@app/App';
import Icon from 'react-native-vector-icons/Ionicons';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./home.jpg')}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.1 }} // Lighter background for a cleaner look
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            {/* Logo */}
            <Image
              source={require('./logo/Limewood_logo.png')} // Replace with the correct path to your logo
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Guest Visitors Log</Text>
            <Text style={styles.hotelName}>Menu</Text>
          </View>

          {/* Menu Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('CheckIn')}
            >
              <Icon name="person-add-outline" size={21} color="#fff" />
              <Text style={styles.actionText}>Check-In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('CheckOut')}
            >
              <Icon name="exit-outline" size={21} color="#fff" />
              <Text style={styles.actionText}>Check-Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Export')}
            >
              <Icon name="download-outline" size={21} color="#fff" />
              <Text style={styles.actionText}>Export</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('History')} // Navigate to HistoryScreen
            >
              <Icon name="time-outline" size={21} color="#fff" />
              <Text style={styles.actionText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Backup')} // Navigate to HistoryScreen
            >
              <Icon name="time-outline" size={21} color="#fff" />
              <Text style={styles.actionText}>BACKUP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('ViewScreen')} // Navigate to HistoryScreen
            >
              <Icon name="time-outline" size={21} color="#fff" />
              <Text style={styles.actionText}>Guest View</Text>
            </TouchableOpacity>
          </View>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Icon name="arrow-back-outline" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#81B304',
    backgroundColor: '#fff', // White background for a clean look
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
    width: '90%',
    borderBottomWidth: 3,
    borderBottomColor: '#81B304',
    borderRadius: 0, // Rounded header section
  },
  logo: {
    width: 100, // Adjust size as needed
    height: 100,
    marginBottom: 20, // Space between logo and title
  },
  title: {
    fontSize: 18,
    color: '#555',
    fontFamily: 'Montserrat-Light',
  },
  hotelName: {
    fontSize: 36,
    color: '#555',
    fontFamily: 'PlayfairDisplay-Bold',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginVertical: 20,
  },
  actionButton: {
    backgroundColor: '#81B304',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15, // Smoother rounded edges
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    width: '30%',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 9,
    margin: 3,
  },
  actionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#555',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '95%',
    marginTop: 20,
    elevation: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default HomeScreen;
