import "./global";

import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text,Platform,ImageBackground } from "react-native";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Pedometer} from 'expo-sensors';
import CircularProgress from 'react-native-circular-progress-indicator';
import WalletConnectExperience from "./WalletConnectExperience";



export default function HomeScreen(props) {
  
  const SCHEME_FROM_APP_JSON = "walletconnect-example";
  const [stepCount,updateStepCount] = React.useState(0)
  const [totalReward,setTotalReward] = React.useState(0)
  const [reward,updateReward] = React.useState(0)
  const [usingNFT,setUsingNFT] = React.useState({type:"Not init",nft_id:-1,start:-1,rare:-1})
  const [PedometerAvailability, setPedometerAvailability] =
  React.useState("");
  

  const _retrieveData = async () => {
    console.log("Da goi vao recei data")
    const useNFT = await AsyncStorage.getItem("NFT");
    const NFT = JSON.parse(useNFT);
    setUsingNFT(NFT)

    const ttReward = await AsyncStorage.getItem("TotalReward");
    let totalRW = JSON.parse(ttReward);
    if(NFT.type=="My NFT"){
      if(totalRW===null){
        totalRW=0
      }
      setTotalReward(totalRW)
    }
      
    
    // console.log("Da goi set")
    // console.log(usingNFT)
    props.LoadNFT(false)
  }
  React.useEffect(()=>{
    _retrieveData()
    if(props.loadNFT)
    _retrieveData()
    
  }
,[props.loadNFT,usingNFT.nft_id])

const saveStep = async (NFT,CountStep,_TotalReward)=>{
  let DailyStep = await AsyncStorage.getItem("DailyStep");
  let dailyStep 
  if(DailyStep===null){
    dailyStep = {}
  }
  else{
    dailyStep = JSON.parse(DailyStep);
  }
  console.log("DAILY STEP 22")
  // console.log(dailyStep)
  try{
    let tdStep = dailyStep[NFT.nft_id].TodayStep
    const NFTitem  = {
      nft_id: NFT.nft_id,
      rare: NFT.rare,
      TodayStep:  tdStep+CountStep
    }
    dailyStep[NFT.nft_id] = NFTitem
  }
  catch(error){
    const NFTitem  = {
      nft_id: NFT.nft_id,
      rare: NFT.rare,
      TodayStep: CountStep
    }
    dailyStep[NFT.nft_id] = NFTitem
  }
  
    console.log(dailyStep)
    
    // console.log(dailyStep)
    await AsyncStorage.setItem("DailyStep",JSON.stringify(dailyStep));

    await AsyncStorage.setItem("TotalReward",JSON.stringify(_TotalReward));
  }

  // await AsyncStorage.setItem("TotalReward",JSON.stringify(reward));

  React.useEffect(()=>{
    let counterStep = 0;
    let _reward = 0;
    let now = Date.now()
    const counter = setInterval(() => {
      
      // Your code
      // console.log("Interval")
      // console.log(usingNFT)
      
      Pedometer.getStepCountAsync(new Date(usingNFT.start!=-1?usingNFT.start:now),new Date(Date.now())).then(
        result => {
          // console.log("goi ham nay 23");
          // console.log("Ket qua la !!!!!!!!!!!!"+result.steps);
          counterStep = result.steps
          updateStepCount(counterStep);
          // && Date.now to hour < 8hour or >9 hour
          if(usingNFT.type=="My NFT" ){
            _reward=totalReward+parseInt(counterStep/10)+parseInt(counterStep/10)*(1+usingNFT.rare)
            updateReward(_reward)
           
          }
        }
      );
    }, 8000);
    return ()=>{
      clearInterval(counter)
      if(usingNFT.nft_id!=-1&&counterStep>0&&_reward>0){
        saveStep(usingNFT,counterStep,_reward)
      }
      
      // await AsyncStorage.setItem("TotalReward",JSON.stringify(reward));
    }
  },[usingNFT.nft_id,totalReward])


  
  
  const subscribe = () =>{   
    Pedometer.isAvailableAsync().then(
      (result) =>{
        setPedometerAvailability(String(result))
      },
      (error) =>{
        setPedometerAvailability(error)
      }
    );
  }



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
