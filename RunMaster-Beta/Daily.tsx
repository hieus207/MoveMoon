import "./global";
import * as React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ModalPicker from "./ModalPicker";
export default function DailyScreen() {
  const [open, setOpen] = React.useState(false);
  const [chooseData,setchooseData] = React.useState('Select item')
  const [isModalVisible,setisModalVisible] = React.useState(false)
  const changeVisible = (bool)=>{
    setisModalVisible(bool);
  }
  const setSelectItem = (data)=>{
    setchooseData(data);
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        onPress={()=>changeVisible(true)}
        >
          <Text>{chooseData}</Text>
        </TouchableOpacity>
        <Modal transparent={true}
        animationType='fade'
        visible={isModalVisible}
        onRequestClose={()=>changeVisible(false)}
        >
          <ModalPicker changeVisible={changeVisible} setSelectItem={setSelectItem}/>
      </Modal>
        
    </View>
  );
}
