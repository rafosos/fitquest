import DumbbelLogo from "@/assets/images/dumbbel_logo";
import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import { StyleSheet, View, ViewStyle } from "react-native"
import StyledText from "./styledText";

interface Props{
    title: string,
    subtitle: string,
    style?: ViewStyle
}

export default function HeaderLogoTitleSubTitle({title, subtitle, style}: Props){
    return (
        <View style={[styles.container, style]}>
            <DumbbelLogo style={styles.logo}/>
            <StyledText style={styles.title}>{title}</StyledText>
            <StyledText style={styles.subtitle}>{subtitle}</StyledText>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center'
    },
    logo: {
        marginBottom: 25, 
    },
    title: {
        fontSize: 25,
        fontFamily: fonts.padrao.Medium500,
        color: colors.branco.padrao,
        textAlign: 'center'
    },
    subtitle:{
        color: colors.cinza.medio3
    },
});