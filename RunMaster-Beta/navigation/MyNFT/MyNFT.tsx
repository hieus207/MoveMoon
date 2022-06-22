import "../../global";
import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text,Platform,ImageBackground, Image,TouchableOpacity,Modal,Button,ScrollView,ActivityIndicator} from "react-native";
import WalletConnectProvider, { useWalletConnect } from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WalletConnectExperience from "../../WalletConnectExperience";
import Web3 from "web3";
import NftContract from "../../contract/NftContract";
import MarketContract from "../../contract/MarketContract";
import DetailModal from "../../ModalDetail";
import ImgShoe from "../ImgShoe";
import ItemShoe from "../ItemShoe";
import LoginModal from "../LoginModal/LoginModal";

// OLD VERSION OF MYSHOELIST_______________________

export default function MyNFTScreen({navigation}) {
  const [isShow,setShow] = React.useState(false)
  const [listNft,setListNft] = React.useState([]);
  const [nft,setNFT] = React.useState([]);
  const [reload,setReload] = React.useState(false)
  const [isloading,setLoading] = React.useState(true)
  const changeVisible = (bool) =>{
    setShow(bool)
  }

  const openPopup = (key) =>{
    setNFT(listNft[key])
    changeVisible(true)
  }

  const Reload = () =>{
    setReload(!reload)
  }

  const MyNFTtoObject = (nft) =>{
    var obj = {}
    obj.owner = nft[0];
    obj.nft_id = parseInt(nft[1]);
    obj.rare = parseInt(nft[2]);
    obj.type = "My NFT";
    return obj
  }

  const MarketNFTtoObject = (nft) =>{
    var obj = {}
    obj.status = nft[0];
    obj.seller = nft[1];
    obj.token = nft[2];
    obj.nft_id = parseInt(nft[3]);
    obj.price = parseInt(nft[4]);
    obj.list_id = parseInt(nft[5]);
    obj.type = "Market NFT";
    return obj
  }
  
  const Logout=()=>{
    navigation.navigate("Login")
  }
  React.useEffect(() => {
    setLoading(true)
    async function getMyNFT() {
    const totalSupply = await NftContract.methods.totalSupply().call();
    let rs=[]
    
    for (let i=1;i<=totalSupply;i++){
      let NFT = await(NftContract.methods.getInfo(i).call())
      // NFT.nftId=i
      console.log("NFT thu "+NFT)
      if(NFT[0].toLowerCase()==global.address.toLowerCase()){
        rs.push(MyNFTtoObject(NFT))
      }
    }

    // const totalList = await MarketContract.methods.totalList().call();
    // for (let i=1;i<=totalList;i++){
    //   let NFT = await(MarketContract.methods.getListing(i).call())
    //   // NFT.nftId=i
    //   if(NFT[0]==1 && NFT[1].toLowerCase()==global.address.toLowerCase()){
    //     NFT=NFT.concat(i)
    //     rs.push(MarketNFTtoObject(NFT))
    //   }
    //   console.log("NFT cho thu "+i)
    // }
    setListNft(rs); 
    setLoading(false)
    }   
    getMyNFT()
    
  }, [reload]);

  const SCHEME_FROM_APP_JSON = "move-moon";

  let Itemlist= listNft.map((item,key)=>{
    return(
      <ItemShoe item={item} key={key}></ItemShoe>
    )
  })


  return (
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
      <View style={styles.container}>

        <Text style={styles.title}>Inventory</Text>
        <Button onPress={()=>setReload(!reload)} title="Reload"/>

        <ActivityIndicator animating={true} size="large" style={{flex:1,opacity:1,display:isloading==true?'flex':'none'}} color="orange"/>
        <ScrollView contentContainerStyle={[styles.listImg,styles.mt_20]} style={{display:isloading==true?'none':'flex'}}>  
      
            {Itemlist}
          
        </ScrollView> 

        <StatusBar hidden />

        {/* <Modal
        transparent={true}
        animationType='fade'
        visible={isShow}
        onRequestClose={()=>changeVisible(false)}
        >
          <DetailModal from="MyNFT" changeVisible={changeVisible} NFT={nft} Reload={Reload} LoadNFT={props.LoadNFT}/>
        </Modal> */}
        <View style={[styles.centerSelf,styles.pos_bottom_btn]}>
              <WalletConnectExperience Logout={Logout} onScreen={"Inventory"}/>
        </View>
        
        
      </View>
    </WalletConnectProvider>
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
  pos_bottom_btn:{
    position:"absolute",
    bottom:40
  },
  centerSelf:{
    alignSelf:"center"
  }
});

