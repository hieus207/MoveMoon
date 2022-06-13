import React from 'react'
import { Image,View,Text,StyleSheet,TouchableOpacity, TextInput,ActivityIndicator} from 'react-native'
import { color } from 'react-native-reanimated';
import WalletConnectExperience from "./WalletConnectExperience";
export default function DetailModal(props){
    const [price,setPrice] = React.useState(0);
    const [txStatus,setTxStatus] = React.useState(0);
    const closeModal = (bool) =>{
        console.log("da an")
        props.changeVisible(bool)
    }
    const setStatus = (stt)=>{
        setTxStatus(stt)
    }
    const testFunction = (val) =>{
        setPrice(val)
        console.log(price)
        
    }
    const Transactions = ()=>{
        if(txStatus==1){
            return(
                <>
                <Text> Transactions  Pending ...</Text>
                <ActivityIndicator animating={true} size="small" style={{opacity:1}} color="#999999"/>
                </> 
            )
        }
        if(txStatus==2){
            return(
                <Text style={{color:"green"}}> Transactions  Success!</Text>
            )
        }
        if(txStatus==3){
            return(
                <Text style={{color:"red"}}> Transactions  Failed!</Text>
            )
        }
    }
    const Element = (()=>{
        
        // MARKETTTTTTTTTTTTTT
        if(props.from=="Market")
        return(<>
                <Image
                  style={{width:150, height:150, borderRadius:20,borderWidth:3, borderColor:"black"}}
                  source={require('./assets/NFT_1.jpg')}/>
                <Text>Price: {props.NFT.price}</Text>
                <WalletConnectExperience onScreen="Market" NFT={props.NFT} setStatus={setStatus} Reload={props.Reload}/>
        </>)

        // MY NFTTTTTTTTTTTTT
        if(props.from=="MyNFT")

        // NFT DANG BAN TREN CHO
        if(props.NFT.type=="Market NFT")
        return(
            <>
            <Image
                  style={{width:150, height:150, borderRadius:20,borderWidth:3, borderColor:"black"}}
                  source={require('./assets/NFT_1.jpg')}/>
                <WalletConnectExperience onScreen="MyNFT" price={price} NFT={props.NFT} setStatus={setStatus} Reload={props.Reload}/>
            </>
        )
        else
        // NFT TRONG VI
        return(<>
                <Image
                  style={{width:150, height:150, borderRadius:20,borderWidth:3, borderColor:"black"}}
                  source={require('./assets/NFT_1.jpg')}/>
                <TextInput style={{borderWidth:1,padding:8,margin:5,width:200,borderColor:'black',borderRadius:20}} onChangeText={(val)=>testFunction(parseInt(val))} placeholder={"Input your Price"} keyboardType={'numeric'}/>
                <WalletConnectExperience onScreen="MyNFT" price={price} NFT={props.NFT} setStatus={setStatus} Reload={props.Reload} LoadNFT={props.LoadNFT}/>
        </>)
    })
    return(
        
            <View style={styles.modal}>
                <Text>Test Modal</Text>
                {/* CHECK RARE RUNG CAC THU IN THONG TIN */}
                
                {Element()}
                {Transactions()}
                <TouchableOpacity
                    onPress={()=>closeModal(false)}>
                        <Text>Close</Text>
                </TouchableOpacity>
            </View>
    )

}
const styles = StyleSheet.create({
    modal:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
    }
})