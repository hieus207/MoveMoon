import "./global";
import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text,Platform,ImageBackground, Image,TouchableOpacity,Modal,Button,ScrollView,ActivityIndicator} from "react-native";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WalletConnectExperience from "./WalletConnectExperience";
import Web3 from "web3";
import NftContract from "./contract/NftContract";
import MarketContract from "./contract/MarketContract";
import DetailModal from "./ModalDetail";



export default function MyNFTScreen(props) {
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
  
  React.useEffect(() => {
    setLoading(true)
    async function getMyNFT() {
    const totalSupply = await NftContract.methods.totalSupply().call();
    let rs=[]
    for (let i=1;i<=totalSupply;i++){
      let NFT = await(NftContract.methods.getInfo(i).call())
      // NFT.nftId=i
      console.log("NFT thu"+i)
      if(NFT[0].toLowerCase()==global.address.toLowerCase()){
        rs.push(MyNFTtoObject(NFT))
      }
    }
    const totalList = await MarketContract.methods.totalList().call();
    for (let i=1;i<=totalList;i++){
      let NFT = await(MarketContract.methods.getListing(i).call())
      // NFT.nftId=i
      if(NFT[0]==1 && NFT[1].toLowerCase()==global.address.toLowerCase()){
        NFT=NFT.concat(i)
        rs.push(MarketNFTtoObject(NFT))
      }
      console.log("NFT cho thu"+i)
    }
    setListNft(rs); 
    setLoading(false)
    }   
    getMyNFT()
    
  }, [reload]);

  const SCHEME_FROM_APP_JSON = "walletconnect-example";

  let Itemlist= listNft.map((item,key)=>{
    return(
      <TouchableOpacity onPress={()=>openPopup(key)} key={"product"+key}> 
      <View>
            <Image
                  style={{width:150, height:150, borderRadius:20,borderWidth:3, borderColor:"black"}}
                  source={require('./assets/NFT_1.jpg')}/>
            {item.type=="Market NFT"? <Text>In Market NFT id: {item.nft_id}</Text>:<Text>NFT id: {item.nft_id}</Text>}
      </View>
      </TouchableOpacity>
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

        <ImageBackground 
        style={{flex:1}}
        resizeMode = 'cover'
        source={require('./assets/running.jpg')}
        >

        <Text style={styles.title}>My NFT</Text>
        <Button onPress={()=>setReload(!reload)} title="Reload"/>

        <ActivityIndicator animating={true} size="large" style={{flex:1,opacity:1,display:isloading==true?'flex':'none'}} color="orange"/>
        <ScrollView contentContainerStyle={styles.listImg} style={{display:isloading==true?'none':'flex'}}>  
      
        {Itemlist}
          
        </ScrollView> 

        {/* SET BG */}
        </ImageBackground>

        <StatusBar style="auto" />

        <Modal
        transparent={true}
        animationType='fade'
        visible={isShow}
        onRequestClose={()=>changeVisible(false)}
        >
          <DetailModal from="MyNFT" changeVisible={changeVisible} NFT={nft} Reload={Reload} LoadNFT={props.LoadNFT}/>
        </Modal>

        
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
  title:{
    color: "green",
    alignSelf: "center",
    fontSize: 35,
    fontWeight: "bold"
  },
  listImg:{
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'flex-start',
    flexWrap:'wrap'
  }
});
