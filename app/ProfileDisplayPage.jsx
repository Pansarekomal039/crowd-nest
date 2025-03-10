import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileDetailsPage = ({ route }) => {
  const { profile } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{profile.restaurantName}</Text>
      <Text>Cuisine: {profile.cuisine}</Text>
      <Text>Street: {profile.street}</Text>
      <Text>Capacity: {profile.no_of_guest} Guests</Text>
      <Text>Open Time: {profile.openTime}</Text>
      <Text>Close Time: {profile.closeTime}</Text>
      <Text>Special Requests: {profile.specialRequest}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ProfileDetailsPage;
