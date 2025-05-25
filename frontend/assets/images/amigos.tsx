import { SvgIconProps } from '@/components/base/svgBase';
import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function Amigos({containerProps, cor}: SvgIconProps){
    return (    
        <View {...containerProps}>
            <Svg width="100%" height="100%" viewBox="0 0 150 150" fill="none">
                <Path d="M100 131.25V118.75C100 112.12 97.3661 105.761 92.6777 101.072C87.9893 96.3839 81.6304 93.75 75 93.75H37.5C30.8696 93.75 24.5107 96.3839 19.8223 101.072C15.1339 105.761 12.5 112.12 12.5 118.75V131.25" stroke={cor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M100 19.55C105.361 20.9398 110.109 24.0704 113.498 28.4504C116.887 32.8304 118.726 38.2118 118.726 43.75C118.726 49.2882 116.887 54.6696 113.498 59.0496C110.109 63.4296 105.361 66.5602 100 67.95" stroke={cor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M137.5 131.25V118.75C137.496 113.211 135.652 107.83 132.259 103.452C128.865 99.0741 124.113 95.9473 118.75 94.5625" stroke={cor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M56.25 68.75C70.0571 68.75 81.25 57.5571 81.25 43.75C81.25 29.9429 70.0571 18.75 56.25 18.75C42.4429 18.75 31.25 29.9429 31.25 43.75C31.25 57.5571 42.4429 68.75 56.25 68.75Z" stroke={cor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
        </View>
)
}