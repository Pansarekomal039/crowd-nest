import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import {
  StyledContainer,
  PageTitle,
  Line,
  StyledButton,
  ButtonText,
  Colors
} from '../components/style';

const { primary } = Colors;

// First define the component
const RestList = ({ navigation, route }) => {
  // Initial state with proper data structure
  const [restaurants, setRestaurants] = React.useState([
    // { 
    //   id: '1', 
    //   fullName: 'Sample Restaurant',
    //   cuisine: 'Indian',
    //   no_of_guest: 50,
    //   openTime: '2024-03-06T09:00:00',
    //   closeTime: '2024-03-06T21:00:00'
    // }
  ]);

  // Safe parameter access
  React.useEffect(() => {
    if (route?.params?.newRestaurant) {
      setRestaurants(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          ...route.params.newRestaurant
        }
      ]);
    }
  }, [route?.params?.newRestaurant]);

  

  return (
    <StyledContainer>
      <PageTitle> Restaurants List</PageTitle>
      <Line />

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.details}>Cuisine: {item.cuisine}</Text>
            <Text style={styles.details}>Capacity: {item.no_of_guest}</Text>
            <Text style={styles.details}>
              Timing: {formatTime(item.openTime)} - {formatTime(item.closeTime)}
            </Text>
          </View>
        )}
      />

      <StyledButton onPress={() => navigation.navigate('RestProfile')}>
        <ButtonText>Add New Restaurant</ButtonText>
      </StyledButton>
    </StyledContainer>
  );
};

RestList.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      newRestaurant: PropTypes.object
    })
  })
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
});

export default RestList;