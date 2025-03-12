import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const RestaurantListPage = ({ navigation }) => {
  const [restaurantProfiles, setRestaurantProfiles] = useState([]);

  // Add some mock data to show
  React.useEffect(() => {
    const profiles = [
      { 
        id: '1',
        restaurantName: 'Durga Cafe',
        cuisine: 'Indian',
        street: '123 Street, City',
        no_of_guest: 50,
      },
      {
        id: '2',
        restaurantName: 'Pizza Palace',
        cuisine: 'Italian',
        street: '456 Avenue, City',
        no_of_guest: 100,
      },
    ];
    setRestaurantProfiles(profiles);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Profiles</Text>
      <FlatList
        data={restaurantProfiles}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate('ProfileDetails', { profile: item });
            }}
          >
            <Text style={styles.cardTitle}>{item.restaurantName}</Text>
            <Text>{item.cuisine}</Text>
            <Text>{item.street}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RestaurantListPage;
