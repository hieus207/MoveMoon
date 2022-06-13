import * as React from 'react';
import {View,Text} from 'react-native';

export default function DailyScreen({navigation}){
    return(
        <View>
            <Text onPress={() => navigation.navigate('Home')}>Hello DailyScreen</Text>
        </View>
    )
}