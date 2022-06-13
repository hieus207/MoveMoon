import React from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";


export default function ModalPicker(props) {
  const [selectedValue, setSelectedValue] = React.useState(0);
  const closeModal = (bool,select) => {
    props.changeVisible(bool);
    props.setSelectItem(select)
  };
  const WIDTH = Dimensions.get("window").width;
  const HEIGHT = Dimensions.get("window").height;
  return (
    <TouchableOpacity style={styles.container}>
      <View style={[styles.modal, { width: WIDTH - 20, height: HEIGHT / 2 }]}>
          
        <Picker
          selectedValue={selectedValue}
          style={{ height: 50, width: 250 }}
          
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
          <Picker.Item label="All Rare" value="0" />
          <Picker.Item label="Rare 1" value="1" />
          <Picker.Item label="Rare 2" value="2" />
          <Picker.Item label="Rare 3" value="3" />
          <Picker.Item label="Rare 4" value="4" />
          <Picker.Item label="Rare 5" value="5" />
        </Picker>
        <TouchableOpacity onPress={() => closeModal(false,selectedValue)} style={styles.btn_choose}>
            <Text>Choose</Text>
        </TouchableOpacity>
      </View>
      
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 10,
    fontWeight: "bold",
    alignItems: "center",
    // justifyContent:"flex-start"
  },
  btn_choose:{
      position:"absolute",
      bottom:20
  }
});
