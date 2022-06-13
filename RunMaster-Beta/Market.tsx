import "./global";
import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text,Platform,ImageBackground, Image,TouchableOpacity,Modal,Button,ScrollView,ActivityIndicator,Picker} from "react-native";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WalletConnectExperience from "./WalletConnectExperience";
import Web3 from "web3";
import NftContract from "./contract/NftContract";
import MarketContract from "./contract/MarketContract";
import DetailModal from "./ModalDetail";
import ModalPicker from "./ModalPicker";



export default function MarketScreen() {
  const [isShow,setShow] = React.useState(false)
  const [listNft,setListNft] = React.useState([]);
  const [childList,setChildListNFT] = React.useState([]);
  const [nft,setNFT] = React.useState([]);
  const [reload,setReload] = React.useState(false)
  const [isloading,setLoading] = React.useState(true)

  
  const [chooseRare,setchooseData] = React.useState(0)
  const [isModalVisible,setisModalVisible] = React.useState(false)
  const changeVisibleRare = (bool)=>{
    setisModalVisible(bool);
  }
  const setSelectItem = (data)=>{

    if(data!=chooseRare){
      setchooseData(data);
      if(data==0){
        setChildListNFT(listNft)
      }else{
        // console.log("Data"+data)
        // console.log(listNft.filter(function (el){return el.rare==data}))
        setChildListNFT(listNft.filter(function (el){return el.rare==data}))
      } 
    }
  }
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
  const MarketNFTtoObject = (nft) =>{
    var obj = {}
    obj.status = nft[0];
    obj.seller = nft[1];
    obj.token = nft[2];
    obj.nft_id = parseInt(nft[3]);
    obj.price = parseInt(nft[4]);
    obj.rare = parseInt(nft[5])
    obj.list_id = parseInt(nft[6]);
    obj.type = "Market NFT";
    return obj
  }
  React.useEffect(() => {
    setLoading(true)
    async function getMarket() {
      console.log("da chay vao load market")
      const totalList = await MarketContract.methods.totalList().call();
      let rs=[]
      console.log(totalList)
      for (let i=1;i<=totalList;i++){
        console.log("Da tai nft thu "+i)
        let NFT = await(MarketContract.methods.getListing(i).call())
        // NFT.nftId=i
        if(NFT[0]==1 && NFT[1].toLowerCase()!=global.address.toLowerCase()){
          let thisNFT = await(NftContract.methods.getInfo(NFT[3]).call())
          NFT=NFT.concat(thisNFT[2],i);
          rs.push(MarketNFTtoObject(NFT))
        }
      }
      
      setLoading(false)
      setListNft(rs); 
      setChildListNFT(rs); 
    }  
    getMarket()
  }, [reload]);

  const SCHEME_FROM_APP_JSON = "walletconnect-example";


  let Itemlist= childList.map((item,key)=>{
    return(
      <TouchableOpacity onPress={()=>openPopup(key)} key={"product"+key}> 
      <View>
            <Image
                  style={{width:150, height:150, borderRadius:20,borderWidth:3, borderColor:"black"}}
                  source={require('./assets/NFT_1.jpg')}/>
            <Text>NFT id: {item.nft_id}</Text>
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

        <Text style={styles.title}>Market Place</Text>
        <Button onPress={()=>setReload(!reload)} title="Reload"/>
        
{/* MODAL CHOOSE RAREEEEEEEEEE */}
        <TouchableOpacity
        onPress={()=>changeVisibleRare(true)}
        >
            <Text>{chooseRare==0?"All Rare":"Rare "+chooseRare}</Text>
        </TouchableOpacity>
        <Modal transparent={true}
        animationType='slide'
        visible={isModalVisible}
        
        onRequestClose={()=>changeVisible(false)}
        >
          <ModalPicker changeVisible={changeVisibleRare} setSelectItem={setSelectItem}/>
        </Modal>
{/* END MODALLLLLL */}

        <ActivityIndicator animating={true} size="large" style={{flex:1,opacity:1,display:isloading==true?'flex':'none'}} color="orange"/>
        <ScrollView contentContainerStyle={styles.listImg} style={{display:isloading==true?'none':'flex'}}>  
      
        {Itemlist}
          
        {/* CONNECT BUTTON */}
        
        {/* <WalletConnectExperience reward={0} /> */}
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
          <DetailModal from="Market" changeVisible={changeVisible} NFT={nft} Reload={Reload}/>
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
