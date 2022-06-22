import "../../global";
import * as React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WalletConnectExperience from "../../WalletConnectExperience";
import Web3 from "web3";
import NftContract from "../../contract/NftContract";
import MarketContract from "../../contract/MarketContract";
import DetailModal from "../../ModalDetail";
import ModalPicker from "../../ModalPicker";
import ImgShoe from "../ImgShoe";
import * as Progress from "react-native-progress";

export default function MarketScreen() {
  const [childList, setChildListNFT] = React.useState([]);
  const [usingNFT, setUsingNFT] = React.useState({
    type: "Not init",
    nft_id: -1,
    start: -1,
    rare: -1,
  });
  const _retrieveData = async () => {
    console.log("Da goi vao recei data");
    const useNFT = await AsyncStorage.getItem("NFT");
    const NFT = JSON.parse(useNFT);
    if (NFT != null) {
      setUsingNFT(NFT);
    } else {
      await AsyncStorage.setItem(
        "NFT",
        JSON.stringify({ type: "Not init", nft_id: -1, start: -1, rare: -1 })
      );
      setUsingNFT({ type: "Not init", nft_id: -1, start: -1, rare: -1 });
    }
  };
  React.useEffect(() => {
    _retrieveData();
  }, []);
  // phai dung redux lay state thay doi de truyen zo day

  const SCHEME_FROM_APP_JSON = "move-moon";

  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
      <Text style={styles.title}>Selected Shoe</Text>
      <View style={styles.shoeBody}>
        <View style={styles.row}>
          <Text style={styles.semiTitle}>
            {usingNFT.nft_id == -1 ? "Not using NFT" : "#" + usingNFT.nft_id}
          </Text>
          <Text style={[styles.semiTitle, styles.Right]}>
            {usingNFT.rare == -1 ? "" : "RARE: " + usingNFT.rare}
          </Text>
        </View>
        <ImgShoe rare={usingNFT.rare}></ImgShoe>
        <Text style={[styles.semiTitle]}>Walker</Text>
        <Text style={[styles.regular, styles.mt_10]}>1-4(km/hr)</Text>
        <Progress.Bar
          style={[styles.mt_10]}
          progress={0.3}
          width={null}
          color={"rgba(255,192,65,255)"}
          unfilledColor={"rgb(148,144,142)"}
          borderWidth={0}
        />
        {/* GAIN TOKEN */}
        <Text style={[styles.regular, styles.mt_10]}>Gain token: 1,25x</Text>
      </View>
      <TouchableOpacity style={[styles.btn, styles.mt_20]}>
        <Text style={styles.btn_text}>Start Run</Text>
      </TouchableOpacity>
      </View>
    </>
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
