import * as React from "react";
import { Image,StyleSheet } from "react-native";


export default function ImgShoe(props) {
    var src = ()=>{
        switch(props.rare){
            default: return <Image style={styles.imgShoe}
                                source={require("../assets/UI/sneaker_1.png")}/>
            case 1:  return <Image style={styles.imgShoe}
                                source={require("../assets/UI/sneaker_1.png")}/>
            case 2: return <Image style={styles.imgShoe}
                                source={require("../assets/UI/sneaker_2.png")}/>
            case 3: return <Image style={styles.imgShoe}
                                source={require("../assets/UI/sneaker_3.png")}/>
            case 4: return <Image style={styles.imgShoe}
                                source={require("../assets/UI/sneaker_4.png")}/>
            case 5: return <Image style={styles.imgShoe}
                                source={require("../assets/UI/sneaker_5.png")}/>
            case 6: return <Image style={styles.imgShoe}
                                source={require("../assets/UI/sneaker_6.png")}/>
        }
    }
    return(
        src()
    )
}

const styles = StyleSheet.create({
    imgShoe: {
        alignSelf:"center",
        // flex:1
    }
})