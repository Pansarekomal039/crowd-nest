import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  StatusBar,
  FlatList
} from "react-native";
import FlatLI from '../components/FlatLI';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getFirestore, collection,query, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as Location from "expo-location";
import RestList from '../app/RestList'; 
import O_Login from '../app/O_Login'; 
// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Drawer Navigator
const Drawer = createDrawerNavigator();

const MainScreen = ({ navigation }) => (
  <O_Login navigation={navigation} />
);
// Placeholder components for the 4 screens
const HomeScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Home Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Profile Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Settings Screen</Text>
  </View>
);


const RestaurantSearch = (navigation, route) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const Auth = getAuth();
  const user = Auth.currentUser;
const firestore = getFirestore();

  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Location Permission Denied", "Please allow location access.");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
      if (reverseGeocode.length > 0) {
        const { city, region, country } = reverseGeocode[0];
        setAddress(`${city}, ${region}, ${country}`);
      }

      setLoading(false);
    };

    getLocation();
  }, []);

  useEffect(() => {
    const q =query(collection(firestore, 'restaurants'));
    const unsubscribe = onSnapshot(q,(querySnapshot)=>{
      const restaurantList = [];
      querySnapshot.forEach((doc)=> {
        restaurantList.push({id: doc.id,...doc.data() });
      });
      setRestaurants(restaurantList);
    });
    return() => unsubscribe();
  },[]);
  const filteredRestaurants = RestaurantSearch.filter((restaurant) => 
  restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <View style={styles.container}>
      <Text style={styles.locationText}>
        📍 {address || "Fetching location..."}
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search for restaurants..."
      />

      {loading && <ActivityIndicator size="large" color="blue" />}
     <FlatLI />
    </View>
  );
};

// Bottom Tab Navigator with 4 screens
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Reservations") {
            iconName = focused ? "document" : "document-outline"; // Correct icon name
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline"; // Correct icon name
          } else if (route.name === "Owner Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home"
       component={RestaurantSearch} 
      options={{headerShown: false}}/>
      <Tab.Screen name="Reservations"
       component={HomeScreen} 
       options={{headerShown: false}}/>
      <Tab.Screen name="Notifications" 
      component={ProfileScreen}
      options={{headerShown: false}}/>
      <Tab.Screen name="Owner Profile" 
      component={O_Login}
      options={{headerShown: false}} />
    </Tab.Navigator>
  );
};

// Drawer Navigator with Bottom Tab Navigator as the main screen
const DrawerNav = () => {
  return (
      <Drawer.Navigator initialRouteName="Crowd-nest">
        <Drawer.Screen name="Crowd-nest" component={BottomTabNavigator} />
        <Drawer.Screen name="About" component={AboutScreen} />
        <Drawer.Screen name="Contact" component={ContactScreen} />
      </Drawer.Navigator>
  );
};

// Additional Drawer Screens
const AboutScreen = () => (
  <View style={styles.screenContainer}>
    <Text>About Screen</Text>
  </View>
);

const ContactScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Contact Screen</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default DrawerNav;