import "./global";
import * as React from "react";
import { Text, TouchableOpacity,View, StyleSheet,ImageBackground, Alert } from "react-native";
import {useWalletConnect,withWalletConnect} from "@walletconnect/react-native-dapp";
import Market from "./contract/Market.json"
import Nft from "./contract/Nft.json"
import NftContract from "./contract/NftContract";
import Web3 from "web3";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { shoesSlice } from "./redux/shoesSlice";
import { usingShoeSelector } from "./redux/selectors";


const web3 = new Web3(new 
  Web3.providers.HttpProvider(Nft.rpc));

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
};

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Button({ onPress, label }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function WalletConnectExperience(props) {
  const dispatch = useDispatch();
  const connector = useWalletConnect();
  const [isApprove,setApprove] = React.useState(false)
  const [isSell,setSell] = React.useState(false)
  const [usingNFT,setUsingNFT] = React.useState({type:"Not init",nft_id:-1,start:-1,rare:-1})
  const [currentHours,setCurrentHours] = React.useState(0)
  const [timeRemaining,setTimeRemaining] = React.useState('')
  const [shoe,setShoe] = React.useState({})
  const setStatus = (stt) =>{
    props.setStatus(stt)
  }

  const convertToUnit  = (number) =>{
    let result=(number*1000000000000000000).toString(16);
    let size = result.length
    for(let i=0;i<64-size;i++){
        result="0"+result   
      }   
    return result
  }

  const convert  = (number) =>{
    let result=(number).toString(16);
    let size = result.length
    for(let i=0;i<64-size;i++){
        result="0"+result   
      }   
    return result
  }

  const to64char = (strings) =>{
    let result=strings;
    let size = result.length
    for(let i=0;i<64-size;i++){
        result="0"+result   
      }   
    return result
  }
 
  // CHECK APPROVE
  React.useEffect(() => {
    async function checkApprove() {
      const isApproveAddress = await NftContract.methods.getApproved(props.NFT.nft_id).call();
      console.log("APROVED?")
      console.log(isApproveAddress)
      if(isApproveAddress==Market.address)
        setApprove(true)
      // console.log("lap")
    }
    async function loadNFT(){
      const useNFT = await AsyncStorage.getItem("NFT");
      const NFT = JSON.parse(useNFT);
      if(NFT!=null){
        setUsingNFT(NFT)
      }else{
        await AsyncStorage.setItem("NFT",JSON.stringify({type:"Not init",nft_id:-1,start:-1,rare:-1}));
        setUsingNFT({type:"Not init",nft_id:-1,start:-1,rare:-1})
      }
      
      
    }
    loadNFT()
    checkApprove()
  }, [usingNFT.nft_id])

  const Cancel = React.useCallback(async (listing_id) => {
    try {
       await connector.sendTransaction({
         to: Market.address,
         from: connector.accounts[0],
         data: '0x40e58ee5'+convert(listing_id),
        }).then(async (result) => {
          console.log(result)
          setStatus(1)
          const getTx = async ()=>{
            let rs = null
            do{
                rs = await web3.eth.getTransactionReceipt(result);
             await timeout(2000)
            }while(rs===null)
            if(rs.status){
              // GOI DEN GD THANH CONG
              setStatus(2)
            }else{
              setStatus(3)
            }
              // GOI DEN GD THAT BAI

          }
          getTx()
          
        }).catch((error) => {
          // Error returned when rejected
          console.error("ERROR"+error);
        });
    } catch (e) {
      console.error(e);
    }
  }, [connector]);

  const Approve = React.useCallback(async (nft_id) => {
    try {
       await connector.sendTransaction({
         to: Nft.address,
         from: connector.accounts[0],
         data: '0x095ea7b3'+to64char(Market.address.slice(2,Market.address.length)).toLowerCase()+convert(nft_id),
        }).then(async (result) => {
          console.log(result)
          setStatus(1)
          const getTx = async ()=>{
            let rs = null
            do{
                rs = await web3.eth.getTransactionReceipt(result);
             await timeout(2000)
            }while(rs===null)
            if(rs.status){
              // GOI DEN GD THANH CONG
              setStatus(2)
              setApprove(true)
            }else{
              setStatus(3)
            }
              // GOI DEN GD THAT BAI

          }
          getTx()
          
        }).catch((error) => {
          // Error returned when rejected
          console.error("ERROR"+error);
        });
    } catch (e) {
      console.error(e);
    }
  }, [connector]);

  const Sell = React.useCallback(async (nft_id,price) => {
    try {
        if(usingNFT.nft_id==nft_id){
          // alert
          Alert.alert(
            "Confirm",
            "Selling used shoes will cancel the expected reward!",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: async () => {
                await connector.sendTransaction({
                  to: Market.address,
                  from: connector.accounts[0],
                  data: '0x7e07590d'+to64char(Nft.address.slice(2,Nft.address.length)).toLowerCase()+convert(nft_id)+convert(price),
                 }).then(async (result) => {
                   const ttReward = await AsyncStorage.getItem("TotalReward");
                   let totalRW = JSON.parse(ttReward);
                   await AsyncStorage.setItem("TotalReward",JSON.stringify(0))
                   console.log(result)
                   setStatus(1)
                   const getTx = async ()=>{
                     let rs = null
                     do{
                         rs = await web3.eth.getTransactionReceipt(result);
                      await timeout(2000)
                     }while(rs===null)
                     if(rs.status){
                       // GOI DEN GD THANH CONG
                       props.Reload()
                       await timeout(2000)
                       
                       setStatus(2)
                       setSell(true)
                       
                     }else{
                       setStatus(3)
                       await AsyncStorage.setItem("TotalReward",JSON.stringify(totalRW))
                     }
                       // GOI DEN GD THAT BAI
         
                   }
                   getTx()
                   
                 }).catch((error) => {
                   // Error returned when rejected
                   console.error("ERROR"+error);
                 });
              }}
            ]
          );
        }       
    } catch (e) {
      console.error(e);
    }
  }, [connector,isApprove]);


  const buyNFT = React.useCallback(async (list_id) => {
    try {
       await connector.sendTransaction({
         to: Market.address,
         from: connector.accounts[0],
         data: '0x2d296bf1'+convert(list_id),
         value: props.NFT.price
        }).then(async (result) => {
          console.log(result)
          setStatus(1)
          const getTx = async ()=>{
            let rs = null
            do{
                rs = await web3.eth.getTransactionReceipt(result);
             await timeout(2000)
            }while(rs===null)
            if(rs.status){
              // GOI DEN GD THANH CONG
              props.Reload()
              await timeout(2000)
              setStatus(2)
              
            }else{
              setStatus(3)
            }
              // GOI DEN GD THAT BAI

          }
          getTx()
          
        }).catch((error) => {
          // Error returned when rejected
          console.error("ERROR"+error);
        });
    } catch (e) {
      console.error(e);
    }
  }, [connector]);

  const useToRun = (NFT) =>{
    function setNFT(nft){
      try{
        Alert.alert(
          "Wait for confirmation",
          "Changing shoes will erase all expected reward! Are you sure?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: async () => {
              const useNFT = nft
              const rs = await AsyncStorage.getItem("NFT");
              const usingNFT = JSON.parse(rs)
              setUsingNFT(usingNFT)
              if(usingNFT.nft_id!=useNFT.nft_id&&usingNFT.nft_id!=-1){
                useNFT.start = Date.now()
              }
              await AsyncStorage.setItem("NFT",JSON.stringify(useNFT));
              await AsyncStorage.setItem("TotalReward",JSON.stringify(0));
              await props.LoadNFT(true)
            } }
          ]
        );  
        dispatch(
          shoesSlice.actions.usingShoeChange(NFT)
        );

      } catch (error){
        Alert.alert("Error",""+error.message,[{Text:"OK"}]);
      }
    }
    setNFT(NFT)
    
    
  }

  const ButtonUse = ()=>{
    try{
      if(usingNFT.nft_id==props.NFT.nft_id){
        return <Text>Using to run</Text>
      }
    }
    catch(error){

    }

    return <Button label="Use to Run" onPress={()=>useToRun(props.NFT)}/>
  }

  // CAN FIX TOKEN . ADDRESS
  const claim = React.useCallback(async () => {
    try {
       await connector.sendTransaction({
         to:"0xa5a50ae4928e427c44c07468813159dec6b2adcc",
         from:connector.accounts[0],
         data: '0x379607f5'+convertToUnit(props.reward)});
    } catch (e) {
      console.error(e);
    }
  }, [connector]);

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
  
    return hrs + ':' + mins + ':' + secs;
  }
  React.useEffect(()=>{
    let timeRemain =''
    async function setNFT(NFT) {
      await AsyncStorage.setItem("NFT",JSON.stringify(NFT));
    }
    const timer = setInterval(() => { // Creates an interval which will update the current data every minute
      // This will trigger a rerender every component that uses the useDate hook.
      let today = new Date(Date.now())
      let current = new Date(Date.now())

      let nextDay,prevDay
      // TRACK TIME TO RESET STEP NFT
      let _current = new Date(Date.now())
      prevDay = _current.setDate(_current.getDate()-1)
      prevDay = _current.setHours(9,0,0,0)
      // new Date(usingNFT.start).getDate()< today.getDate() &&
      if(usingNFT.start<prevDay&&usingNFT.type=="My NFT"){
        usingNFT.start = prevDay
        setNFT(usingNFT)
      }
      
      // console.log("Day la start time")
      // console.log(new Date(usingNFT.start))
      // console.log("Day la prev day")
      // console.log(new Date(prevDay))

      // TRACK TIME TO CALC REMAIN TIME TO CLAIM

      if(current.getHours()>9){
        nextDay = current.setDate(current.getDate()+1)
        nextDay = current.setHours(3,0,0,0)
        timeRemain = msToTime(nextDay-today)
      }
      else{
        // console.log("vao else")
        nextDay = current.setHours(3,0,0,0)
   
        timeRemain = msToTime(nextDay-today)
      }

      setTimeRemaining(timeRemain)
      setCurrentHours(today.getHours());

    }, 5 * 1000);
    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    }
  },[usingNFT.nft_id])

  const LogoutAndkillSession=()=>{
    killSession();
    props.Logout();
  }
  const ButtonClaim = ()=>{
    if(currentHours>=3&&currentHours<9)
      return <Button onPress={claim} label="Claim" />
    
    return (
            <>
              <Text>Time Remaining: {timeRemaining}</Text>
            </>
            )
  }
  const Elements = ()=>{
    if (!connector.connected){
      global.address="";
      return <Button onPress={connectWallet} label="Connect a wallet" />
    }
    else {
      global.address=connector.accounts[0];
      if(props.onScreen=="Login"){
        props.loggedIn()
        // return(
        //   <>
          
        //   <Text>{shortenAddress(connector.accounts[0])}</Text>
        //   <Button onPress={killSession} label="Log out" />
        //   </>
        // )
      }else
      if(props.onScreen=="Inventory"){
        if(connector.connected)
        return(
            <Button onPress={LogoutAndkillSession} label="Log out" />
        )
      }
      if(props.onScreen=="Home"){
        return(
          <>
          <Text>{shortenAddress(connector.accounts[0])}</Text>
            <Text>Can Claim: {props.reward}</Text>
            {/* <Button onPress={claim} label="Claim" /> */}
            {ButtonClaim()}
            <Button onPress={killSession} label="Log out" />
          </>
        )
      } else if(props.onScreen=="Market"){
        return(
          <Button onPress={()=>buyNFT(props.NFT.list_id)} label="Buy"/>
        )
      } else if(props.onScreen=="MyNFT"){
        if(props.NFT.type=="Market NFT"||isSell){
          return(
              <Button onPress={()=>Cancel(props.NFT.list_id)} label="Cancel List"/>
          )
        }else
        if(!isApprove)
        return(
          <>
          {ButtonUse()}
          <Button onPress={()=>Approve(props.NFT.nft_id)} label="Approve"/>
          </>    
        )
        else
        return(
          <>
          {ButtonUse()}
          <Button onPress={()=>Sell(props.NFT.nft_id,props.price)} label="Sell"/>
          </>
        )
        // else return button sell
      }
    }
  }
  return (
    <>
    {Elements()}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(255,193,64,255)",
    color: "#FFFFFF",
    borderRadius: 20,
    width: 300,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    textAlign:"center",
    color: "black",
    fontSize: 20,
    fontWeight: "bold",

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
});
