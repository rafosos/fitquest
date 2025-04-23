import { colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function TreinoLayout(){
    return (<Stack screenOptions={{headerShown: false, contentStyle: {"backgroundColor": colors.cinza.background}}}/>)
}