import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import {
    StyledContainer,
    PageTitle,
    Line,
    StyledButton, 
    ButtonText,
    Colors
} from '../components/style';

const { primary } = Colors;

const RestList = ({ navigation, route }) => {
    const [restaurants, setRestaurants] = React.useState([
        { id: '1', name: 'Sample Restaurant', cuisine: 'Indian', capacity: '50' }
    ]);

    React.useEffect(() => {
        if (route.params?.newRestaurant) {
            setRestaurants(prev => [
                ...prev,
                { id: Date.now().toString(), ...route.params.newRestaurant }
            ]);
        }
    }, [route.params?.newRestaurant]);

    return (
        <StyledContainer>
            <PageTitle>Registered Restaurants</PageTitle>
            <Line />

            <FlatList
                data={restaurants}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.name}>{item.fullName}</Text>
                        <Text style={styles.details}>Cuisine: {item.cuisine}</Text>
                        <Text style={styles.details}>Capacity: {item.no_of_guest}</Text>
                        <Text style={styles.details}>Timing: {formatTime(item.openTime)} - {formatTime(item.closeTime)}</Text>
                    </View>
                )}
            />

            <StyledButton onPress={() => navigation.navigate('RestProfile')}>
                <ButtonText>Add New Restaurant</ButtonText>
            </StyledButton>
        </StyledContainer>
    );
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