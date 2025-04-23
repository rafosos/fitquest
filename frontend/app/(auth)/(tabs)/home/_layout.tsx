import { colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function HomeLayout(){
    return (<Stack screenOptions={{headerShown: false, contentStyle: {"backgroundColor": colors.cinza.background}}}/>)
}