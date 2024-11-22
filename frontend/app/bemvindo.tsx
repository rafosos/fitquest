import StyledText from "@/components/base/styledText";
import GradienteInicio from "@/components/GradienteInicio";
import { Feather } from "@expo/vector-icons";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";

export default function BemVindo(){
    return (
        <View style={styles.containerSplash}>
            <GradienteInicio semImagem/>
            <StyledText style={styles.title}>Bem-vindo ao FitQuest</StyledText>
            <Image style={styles.avatarSplash} resizeMode="contain" source={require("@/assets/images/avatar-splash.png")}/>
            <Feather onPress={() => router.replace("/login")} name="chevrons-right" style={styles.iconeChevron} />
        </View>
    )
}

const styles = StyleSheet.create({
    containerSplash: {
        backgroundColor: colors.branco.padrao,
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarSplash: {
        height: Dimensions.get('window').height * 0.7
    },
    iconeChevron:{
        fontSize: 40, 
        color: colors.preto.padrao, 
        position: 'absolute', 
        right: 10,
        alignSelf: 'center'
    },
    title: {
        fontSize: 40,
        fontFamily: fonts.padrao.Medium500,
        textAlign: 'center'
    }
})