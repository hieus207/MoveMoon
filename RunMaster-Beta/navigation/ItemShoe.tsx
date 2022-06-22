import * as React from "react";
import ImgShoeforList from "./ImgShoeforList";
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
  Picker,
} from "react-native";
import * as Progress from "react-native-progress";

export default function ItemShoe(props) {
  return (
    
    <TouchableOpacity style={styles.shoeBody} key={"product"+props.key}>
      <View style={styles.row}>
        <Text style={styles.semiTitle}>
          {props.item.nft_id == -1 ? "Not using NFT" : "#" + props.item.nft_id}
        </Text>
        <Text style={[styles.semiTitle, styles.Right]}>
          {props.item.rare == -1 ? "" : "RARE: " + props.item.rare}
        </Text>
      </View>
      <ImgShoeforList rare={props.item.rare}></ImgShoeforList>
      <Text style={[styles.semiTitle,styles.mt_5]}>Walker</Text>
      <Text style={[styles.regular, styles.mt_5]}>1-4(km/hr)</Text>
      <Progress.Bar
        style={[styles.mt_5]}
        progress={0.3}
        width={null}
        color={"rgba(255,192,65,255)"}
        unfilledColor={"rgb(148,144,142)"}
        borderWidth={0}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
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
    width:"40%",
    borderRadius: 10,
    backgroundColor: "#e8e7e8",
    padding:20
  },
  semiTitle: {
    fontSize: 15,
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
  mt_5: {
    marginTop: 5,
  },
  mt_10: {
    marginTop: 10,
  },
  mt_20: {
    marginTop: 20,
  },
});
