import "../../global";

import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text,Platform,Image, ImageBackground,TouchableOpacity, Modal } from "react-native";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Pedometer} from 'expo-sensors';
import CircularProgress from 'react-native-circular-progress-indicator';
import WalletConnectExperience from "../../WalletConnectExperience";
import { Provider, useDispatch, useSelector } from "react-redux";
import { usingShoeSelector } from "../../redux/selectors";
import { shoesSlice } from "../../redux/shoesSlice";
import store from "../../redux/store";
import LoginModal from "../LoginModal/LoginModal";


export default function HomeScreen(props) {
  const usingShoe = useSelector(usingShoeSelector);
  const [isShow,setShow] = React.useState(true)
  const SCHEME_FROM_APP_JSON = "move-moon";
  const [stepCount,updateStepCount] = React.useState(0)
  const [distance,updateDistance] = React.useState(0)
  const [totalReward,setTotalReward] = React.useState(0)
  const [reward,updateReward] = React.useState(0)
  const [usingNFT,setUsingNFT] = React.useState({type:"Not init",nft_id:-1,start:-1,rare:-1})
  const [PedometerAvailability, setPedometerAvailability] =
  React.useState("");

  
  const _retrieveData = async () => {
    console.log("Da goi vao recei data")
    const useNFT = await AsyncStorage.getItem("NFT");
    const NFT = JSON.parse(useNFT);
    if(NFT!=null){
      setUsingNFT(NFT)
      // dispatch(
      //   shoesSlice.actions.usingShoeChange(NFT)
      // );
    }
      
    else{
      await AsyncStorage.setItem("NFT",JSON.stringify({type:"Not init",nft_id:-1,start:-1,rare:-1}));
      setUsingNFT({type:"Not init",nft_id:-1,start:-1,rare:-1})
    }

    const ttReward = await AsyncStorage.getItem("TotalReward");
    let totalRW = JSON.parse(ttReward);
    if(NFT.type=="My NFT"){
      if(totalRW===null){
        totalRW=0
      }
      setTotalReward(totalRW)
    }
    props.LoadNFT(false)
  }
  React.useEffect(()=>{
    _retrieveData()
    if(props.loadNFT)
    _retrieveData()
    
  }
,[props.loadNFT,usingNFT.nft_id])

React.useEffect(()=>{
  _retrieveData()
},[])

const saveStep = async (NFT,CountStep,_TotalReward)=>{
  let DailyStep = await AsyncStorage.getItem("DailyStep");
  let dailyStep 
  if(DailyStep===null){
    dailyStep = {}
  }
  else{
    dailyStep = JSON.parse(DailyStep);
  }
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
    let Distance = 0;
    let _reward = 0;
    let start = Date.now()
    const updateStartTimeNFT = async (NFT)=>{
      await AsyncStorage.setItem("NFT",JSON.stringify(NFT));
    }
    if(!usingNFT.hasOwnProperty("start")){
      usingNFT.start = start
      updateStartTimeNFT(usingNFT)
    }
    else
    {
      if(usingNFT.start>0) 
        start=usingNFT.start
      else{
        usingNFT.start = start
        updateStartTimeNFT(usingNFT)
      }
        
    }
    const counter = setInterval(() => {
      // console.log("goi ham nay 22");
      console.log()
      Pedometer.getStepCountAsync(new Date(usingNFT.start!=-1?usingNFT.start:now),new Date(Date.now())).then(
        result => {
          // console.log("goi ham nay 23");
          // console.log("Ket qua la !!!!!!!!!!!!"+result.steps);
          counterStep = result.steps
          Distance = counterStep*0.001
          updateStepCount(counterStep);
          updateDistance(Distance.toFixed(3))
          // && Date.now to hour < 8hour or >9 hour
          if(usingNFT.type=="My NFT" ){
            _reward=totalReward+parseInt(counterStep/10)+parseInt(counterStep/10)*(1+usingNFT.rare)
            updateReward(_reward)
           
          }
        }
      );
    }, 2000);
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
  const st = useSelector((state)=> state.usingShoe);


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
      <View style={[styles.container]}>
      <StatusBar hidden />
      <ImageBackground style={[styles.circle]} resizeMode = 'cover' source={require('../../assets/UI/circle.png')}>
        <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
            <Text style={[styles.RegularTitle]}>Current Session</Text>
            <Text style={[styles.BoldWhiteTitle]}>40 min</Text>
            <Text style={[styles.whiteRegular]}>Medium Intensity</Text>
            <Text style={[styles.timeCounter]}>10:09</Text>
            <TouchableOpacity>
                <Image style={[styles.img_btn]} source={require("../../assets/UI/button_pause.png")}/>
            </TouchableOpacity>
        </View> 
      </ImageBackground>

      <ImageBackground style={[styles.astro]} resizeMode = 'cover' source={require('../../assets/UI/astronaut.png')}/>

      <TouchableOpacity style={[styles.btn_cancel, styles.mt_20]}>
        <Text style={styles.btn_cancel_text}>Cancel</Text>
      </TouchableOpacity>
      <View style={[styles.row,styles.space_around]}>
        <View style={[styles.column,styles.item_center]}>
          <Text style={[styles.reguTitle]}>Kilometres</Text>
          <Text style={[styles.regular,styles.bold]}>{distance}</Text>
        </View>
        <View style={[styles.column,styles.item_center]}>
          <Text style={[styles.reguTitle]}>Steps</Text>
          <Text style={[styles.regular,styles.bold]}>{stepCount}</Text>
        </View>
      </View>
      <View style={[styles.column,styles.item_center]}>
          <Text style={[styles.reguTitle]}>Token</Text>
          <Text style={[styles.regular,styles.bold]}>{reward}</Text>
      </View>
      <TouchableOpacity style={[styles.btn, styles.mt_20]}>
        <Text style={styles.btn_text}>Claim Token</Text>
      </TouchableOpacity>
      </View>
    </WalletConnectProvider>
    
  );
}

const styles = StyleSheet.create({
  astro:{
    position:"absolute",
    top:20,
    width:"49.5%",
    height:"23.5%"
  },
  circle:{
    // flex:0.5,
    width:"75.5%",
    height:"45.5%",
    marginTop:84,
    // alignSelf:"center",
    // flex:0.5,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // borderWidth:3,
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
  column:{
    flexDirection: "column",
  },
  space_around:{
    width:"100%",
    justifyContent:"space-around",
  },
  item_center:{
    alignItems:"center"
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
  btn_cancel:{
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    paddingBottom: 10,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    width: 100,
    alignSelf: "center",
  },
  btn_cancel_text:{
    fontSize: 15,
    // fontWeight: "bold",
  },
  img_btn:{
    width:45,
    height:45
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
  RegularTitle:{
    color: "#ffffff",
    fontSize:20
  },
  BoldWhiteTitle:{
    color: "#ffffff",
    fontSize:20,
    fontWeight:"bold"
  },
  whiteRegular:{
    color:"#ffffff",
  },
  timeCounter:{
    fontSize:55,
    fontWeight:"bold",
    color:"#404042"
  },
  bold:{
    fontWeight:"bold"
  },
  reguTitle:{
    fontSize:20,
    fontWeight:"bold"
  }
});
