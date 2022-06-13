import "./global";

import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text,Platform,ImageBackground} from "react-native";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Pedometer} from 'expo-sensors';
import CircularProgress from 'react-native-circular-progress-indicator';
import WalletConnectExperience from "./WalletConnectExperience";



export default function HomeScreen(props) {

  const SCHEME_FROM_APP_JSON = "walletconnect-example";
  const [stepCount,updateStepCount] = React.useState(0)
  const [oldStep,updateOldStep] = React.useState(0)
  const [reward,updateReward] = React.useState(0)
  const [usingNFT,setUsingNFT] = React.useState({type:"Not init",nft_id:-1})
  const [PedometerAvailability, setPedometerAvailability] =
  React.useState("");
  

  const _retrieveData = async () => {
    const useNFT = await AsyncStorage.getItem("NFT");
  
    const NFT = JSON.parse(useNFT);
    // console.log("Tu ham moi test")
    // console.log(NFT)
    setUsingNFT(NFT)
    // console.log("USING NFT")
    // console.log(usingNFT)
    // console.log("Day la kq")
    // console.log(usingNFT.oldStep!=null)
    props.LoadNFT(false)
  }
  React.useEffect(()=>{
    // LOAD NFT
    // console.log("call : LOAD NFT")
    _retrieveData()
    if(props.loadNFT)
    _retrieveData()
    subscribe();
    // try{
    //   loadNFT()
    //   if(props.loadNFT==true){
    //     loadNFT()
    //   }
    // }
    // catch(error){
    //   console.log("Loi load NFT")
    // }
    // // 
    // return ()=>{
    //   console.log("Truoc khi unmount")
    //   console.log(usingNFT)
    // }
  }
,[props.loadNFT,usingNFT.nft_id])

  React.useEffect(()=>{
    
  },[])

  React.useEffect(()=>{
    console.log("goi ham nay 223")
    console.log(new Date(Date.now()-86400000))
    
    Pedometer.getStepCountAsync(new Date(Date.now()-86400000),new Date(Date.now())).then(
      result => {
        console.log("goi ham nay 23");
        console.log("Ket qua la !!!!!!!!!!!!"+result.steps);
      },
      error => {
        this.setState({
          pastStepCount: 'Could not get stepCount: ' + error,
        });
      }
    );
  },[])
  React.useEffect(()=>{
    console.log("1 step"+stepCount)
    async function CheckPoint() {
      console.log("2 step"+stepCount)
      if(usingNFT.type=="My NFT"){
        updateReward(parseInt((stepCount-usingNFT.oldStep)/10)+parseInt((stepCount-usingNFT.oldStep)/10)*(1+usingNFT.rare))
        if(usingNFT.nft_id!=-1&&usingNFT.isNew){
          console.log("vao if")
          console.log(usingNFT)
          
          usingNFT.isNew=false;
          await AsyncStorage.setItem("NFT",JSON.stringify(usingNFT));
        }
      }
    }
    CheckPoint()
  },[])
  
  const subscribe = () =>{
    Pedometer.watchStepCount((result)=>{
      if(usingNFT.nft_id!=-1){
        console.log("0-----------------------------------------------0")
        console.log(result)
        console.log(usingNFT.oldStep)
        
        updateStepCount(result.steps-usingNFT.oldStep);
      }
      else{
        console.log("Chua cap nhat dc")
      }
    })
    Pedometer.isAvailableAsync().then(
      (result) =>{
        setPedometerAvailability(String(result))
      },
      (error) =>{
        setPedometerAvailability(error)
      }
    );
  }


  React.useEffect(()=>{
    console.log("1 step"+stepCount)
    async function getStep() {

      console.log("call getstep")
      if(usingNFT.nft_id!=-1){
        usingNFT.currentStep=stepCount;
        console.log(usingNFT)
        await AsyncStorage.setItem("NFT",JSON.stringify(usingNFT));
      }
      
    }
    getStep()
  },[stepCount])

  const getNFT = ()=>{
      try{
        if(usingNFT.type!="Not init")
        return(
          <>
          <Text>Using NFT: {usingNFT.nft_id}</Text>
          <Text>Rare: {usingNFT.rare}</Text>
          </>
          )
      }
      catch(error){
        return(
          <Text>Not using any NFT</Text>
        )
      }     
  }

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

      
      <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      {/* TITLE */}
      <Text style={styles.title}>RunMaster</Text>
      
      {getNFT()}
      <View style={{borderRadius: 165,backgroundColor: 'rgba(0,0,1,0.8)'}}>
        <CircularProgress
        value={stepCount}
        maxValue={6500}
        radius={150}
        textColor={'#ECF0F1'}
        activeStrokeColor={'#F39C12'}
        inActiveStrokeColor={'#9B59B6'}
        inActiveStrokeOpacity={0.65}
        inActiveStrokeWidth={40}
        activeStrokeWidth={40}
        title={"Step"}
        titleColor = {"#F39C12"}
        titleStyle = {{fontWeight:"bold"}}
        >
        </CircularProgress>
      </View>

      <Text>Pedometer : {PedometerAvailability}</Text>
      {/* CONNECT BUTTON */}
      <WalletConnectExperience reward={reward} onScreen={"Home"}/>
      </View> 

      {/* SET BG */}
      </ImageBackground>

        <StatusBar style="auto" />
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
  }
});
