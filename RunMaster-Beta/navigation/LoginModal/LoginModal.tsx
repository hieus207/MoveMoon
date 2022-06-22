import React from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { color } from "react-native-reanimated";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import WalletConnectExperience from "../../WalletConnectExperience";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginModal({ navigation }) {

const loggedIn = ()=>{
  navigation.navigate('TabNav')
}
const SCHEME_FROM_APP_JSON = "move-moon";
  return (
    <View style={styles.container}>
      <WalletConnectProvider
        redirectUrl={
          Platform.OS === "web"
            ? window.location.origin
            : `${SCHEME_FROM_APP_JSON}://`
        }
        storageOptions={{
          asyncStorage: AsyncStorage,
        }}
      >
        <WalletConnectExperience onScreen={"Login"} loggedIn={loggedIn}/>
        <TouchableOpacity style={[styles.btn, styles.mt_20]} onPress={loggedIn}>
        <Text style={styles.btn_text}>Login As Guest</Text>
      </TouchableOpacity>
      </WalletConnectProvider>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 50,
    marginLeft: 20,
    alignSelf: "flex-start",
    fontSize: 35,
    fontWeight: "bold",
  },
  listImg: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  shoeBody: {
    borderRadius: 20,
    backgroundColor: "#e8e7e8",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 50,
    paddingBottom: 50,
  },
  semiTitle: {
    fontSize: 28,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
  },
  Right: {
    position: "absolute",
    right: 0,
  },

  btn: {
    borderRadius: 20,
    backgroundColor: "rgba(255,193,64,255)",
    paddingBottom: 10,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    width: 300,
    alignSelf: "center",
  },
  btn_text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  regular: {
    fontSize: 17,
  },
  mt_10: {
    marginTop: 10,
  },
  mt_20: {
    marginTop: 20,
  },
});


