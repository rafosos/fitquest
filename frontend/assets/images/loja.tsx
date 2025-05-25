import SvgBase from '@/components/base/svgBase';
import React from 'react';
import { ViewProps } from 'react-native';
import { Path } from 'react-native-svg';

interface Props{
    containerProps?: ViewProps
    cor: string
}

export default function Loja({containerProps, cor}:Props){
    return (    
        <SvgBase
            containerProps={containerProps}
            path={[
                <Path key={"path1"} d="M37.5 12.5L18.75 37.5V125C18.75 128.315 20.067 131.495 22.4112 133.839C24.7554 136.183 27.9348 137.5 31.25 137.5H118.75C122.065 137.5 125.245 136.183 127.589 133.839C129.933 131.495 131.25 128.315 131.25 125V37.5L112.5 12.5H37.5Z" stroke={cor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>,
                <Path key={"path2"} d="M18.75 37.5H131.25" stroke={cor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>,
                <Path key={"path3"} d="M100 62.5C100 69.1304 97.3661 75.4893 92.6777 80.1777C87.9893 84.8661 81.6304 87.5 75 87.5C68.3696 87.5 62.0107 84.8661 57.3223 80.1777C52.6339 75.4893 50 69.1304 50 62.5" stroke={cor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>,
            ]}
        />
    )
}