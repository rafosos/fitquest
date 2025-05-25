import SvgBase from '@/components/base/svgBase';
import React from 'react';
import { ViewProps } from 'react-native';
import { Path } from 'react-native-svg';

interface Props{
    cor: string
    containerProps?: ViewProps
}

export default function Trofeu ({cor, containerProps}: Props){
    return (
        <SvgBase
            containerProps={containerProps}
            path={[
                <Path key={"path1"} d="M37.5 56.25H28.125C23.981 56.25 20.0067 54.6038 17.0765 51.6735C14.1462 48.7433 12.5 44.769 12.5 40.625C12.5 36.481 14.1462 32.5067 17.0765 29.5765C20.0067 26.6462 23.981 25 28.125 25H37.5" stroke={cor} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>,
                <Path key={"path2"} d="M112.5 56.25H121.875C126.019 56.25 129.993 54.6038 132.924 51.6735C135.854 48.7433 137.5 44.769 137.5 40.625C137.5 36.481 135.854 32.5067 132.924 29.5765C129.993 26.6462 126.019 25 121.875 25H112.5" stroke={cor} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>,
                <Path key={"path3"} d="M25 137.5H125" stroke={cor} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>,
                <Path key={"path4"} d="M62.5 91.625V106.25C62.5 109.688 59.5625 112.375 56.4375 113.812C49.0625 117.187 43.75 126.5 43.75 137.5" stroke={cor} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>,
                <Path key={"path5"} d="M87.5 91.625V106.25C87.5 109.688 90.4375 112.375 93.5625 113.812C100.938 117.187 106.25 126.5 106.25 137.5" stroke={cor} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>,
                <Path key={"path6"} d="M112.5 12.5H37.5V56.25C37.5 66.1956 41.4509 75.7339 48.4835 82.7665C55.5161 89.7991 65.0544 93.75 75 93.75C84.9456 93.75 94.4839 89.7991 101.517 82.7665C108.549 75.7339 112.5 66.1956 112.5 56.25V12.5Z" stroke={cor} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>,
            ]} 
        />
    )
}
