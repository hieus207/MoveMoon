import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  LogBox,
  Text,
  View,
  Button,
} from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


// Font Awesome Icons...
import { FontAwesome5 } from "@expo/vector-icons";
import { useRef } from "react";
import HomeScreen from "./navigation/Home/Home";
import MarketScreen from "./navigation/Market/Market";
import MyNFTScreen from "./navigation/MyNFT/MyNFT";
import DailyScreen from "./Daily";
import { Provider, useSelector } from "react-redux";
import store from "./redux/store";
import LoginModal from "./navigation/LoginModal/LoginModal";
import { createStackNavigator } from "@react-navigation/stack";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNav(tabOffsetValue){
  return(   
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,

        // Floating Tab Bar...
        style: {
          backgroundColor: "white",
          position: "absolute",
          bottom: 40,
          marginHorizontal: 20,
          // Max Height...
          height: 60,
          borderRadius: 10,
          // Shadow...
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowOffset: {
            width: 10,
            height: 10,
          },
          paddingHorizontal: 20,
        },
      }}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name={"Inventory"}
        component={MyNFTScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                // centring Tab Button...
                position: "absolute",
                top: 12,
              }}
            >
              <Image
              style={{ width: 25, height: 25 }}
              source={require('./assets/UI/icon_home.png')}
            />
            </View>
          ),
        }}
        listeners={({ navigation, route }) => ({
          // Onpress Update....
          tabPress: e => {
            Animated.spring(tabOffsetValue, {
              toValue: 0,
              useNativeDriver: true
            }).start();
          }
        })}
      ></Tab.Screen>

      <Tab.Screen name={"SelectShoe"}
        component={MarketScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                // centring Tab Button...
                position: "absolute",
                top: 12,
              }}
            >
              <Image
              style={{ width: 30, height: 26 }}
              source={require('./assets/UI/icon_sneaker.png')}
            />
            </View>
          ),
        }}
        listeners={({ navigation, route }) => ({
          // Onpress Update....
          tabPress: e => {
            Animated.spring(tabOffsetValue, {
              toValue: 0,
              useNativeDriver: true
            }).start();
          }
        })}
      ></Tab.Screen>

      <Tab.Screen name={"Run"}
        component={() => <HomeScreen/>}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                // centring Tab Button...
                position: "absolute",
                top: 12,
              }}
            >
              <Image
              style={{ width: 23, height: 25 }}
              source={require('./assets/UI/icon_run.png')}
            />
            </View>
          ),
        }}
        listeners={({ navigation, route }) => ({
          // Onpress Update....
          tabPress: e => {
            Animated.spring(tabOffsetValue, {
              toValue: 0,
              useNativeDriver: true
            }).start();
          }
        })}
      ></Tab.Screen>

    </Tab.Navigator>
  )
}

function Feed(){
  return(
    <Text>Feed</Text>
  )
}
function Messages(){
  return(
    <Text>Messages</Text>
  )
}

const TestScreen = ({ navigation })=>{
  return(
    <Text  onPress={() =>
      navigation.navigate('TabNav')}>Go to screen 4</Text>
  )
}

LogBox.ignoreLogs([
  "Warning: ...",
  "Looks like",
  "Unhandle",
  "The provided ...",
  "See ...",
]); // Ignore log notification by message
console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
LogBox.ignoreAllLogs(); //Ignore all log notifications
// Hiding Tab Names...
export default function App() {
  // Animated Tab Indicator...
  const [loadNFT, setLoadNFT] = React.useState(true);
  const LoadNFT = (bool) => {
    setLoadNFT(bool);
    // console.log(store.getState())
  };
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  return (
    <Provider store={store}>
      <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown:false
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginModal}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen
          name = "TabNav"
          component={()=>TabNav(tabOffsetValue)}
        />
        </Stack.Navigator>

    </NavigationContainer>
    </Provider>
  );
}


function getWidth() {
  let width = Dimensions.get("window").width;

  // Horizontal Padding = 20...
  width = width - 80;

  // Total five Tabs...
  return width / 5;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
