import React from 'react';
import { View, ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function Loja(props: ViewProps){
    return (    
        <View {...props}>
            <Svg width="100%" height="100%" viewBox="0 0 150 150" fill="none">
                <Path d="M37.5 12.5L18.75 37.5V125C18.75 128.315 20.067 131.495 22.4112 133.839C24.7554 136.183 27.9348 137.5 31.25 137.5H118.75C122.065 137.5 125.245 136.183 127.589 133.839C129.933 131.495 131.25 128.315 131.25 125V37.5L112.5 12.5H37.5Z" stroke="#CC00C5" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M18.75 37.5H131.25" stroke="#CC00C5" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M100 62.5C100 69.1304 97.3661 75.4893 92.6777 80.1777C87.9893 84.8661 81.6304 87.5 75 87.5C68.3696 87.5 62.0107 84.8661 57.3223 80.1777C52.6339 75.4893 50 69.1304 50 62.5" stroke="#CC00C5" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
        </View>
    )
}