import SvgBase, { SvgIconProps } from "@/components/base/svgBase";
import { Path } from "react-native-svg";

export default function HomeSvg({cor, containerProps}: SvgIconProps){
    return (
        <SvgBase containerProps={containerProps}
            path={[
                <Path key={"path1"} d="M 14.299 65.307 C 14.299 63.462 14.725 61.636 15.545 59.96 C 16.365 58.284 17.56 56.8 19.051 55.607 L 65.949 17.528 C 68.369 15.59 71.433 14.529 74.601 14.529 C 77.769 14.529 80.831 15.59 83.252 17.528 L 130.151 55.607 C 131.642 56.8 132.836 58.284 133.66 59.96 C 134.48 61.636 134.902 63.462 134.902 65.307 L 134.902 122.437 C 134.902 125.805 133.491 129.034 130.978 131.413 C 128.466 133.794 125.056 135.132 121.503 135.132 L 27.699 135.132 C 24.143 135.132 20.739 133.794 18.222 131.413 C 15.71 129.034 14.299 125.805 14.299 122.437 L 14.299 65.307 Z" stroke={cor} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
                <Path key={"path2"} d="M 93.315 135.132 L 93.315 85.106 C 93.315 83.445 92.66 81.854 91.488 80.685 C 90.319 79.51 88.731 78.851 87.079 78.851 L 62.126 78.851 C 60.469 78.851 58.883 79.51 57.711 80.685 C 56.543 81.854 55.887 83.445 55.887 85.106 L 55.887 135.132" stroke={cor} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            ]}
        />
    ) 
}