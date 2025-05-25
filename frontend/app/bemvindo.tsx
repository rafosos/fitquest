import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { colors } from "@/constants/Colors";
import HeaderLogoTitleSubTitle from "@/components/base/headerLogoTitleSub";
import ActionButton from "@/components/ActionButton";
import CardSplashInicial from "@/components/CardSplashInicial";
import Trofeu from "@/assets/images/trofeu";
import Amigos from "@/assets/images/amigos";
import Loja from "@/assets/images/loja";

export default function BemVindo(){
    return (
        <View style={styles.container}>
            <HeaderLogoTitleSubTitle
                title="FitQuest"
                subtitle="Transforme seus treinos em desafios divertidos e conecte-se com amigos  apra alcançar seus objetivos fitness"
            />
            
            <View style={styles.containerCards}>
                <CardSplashInicial
                    title="Campeonatos"
                    icone={<Trofeu cor={colors.dourado.padrao2}/>}
                    text="Participe de desafios e ganhe recompensas"
                />

                <CardSplashInicial
                    title="Amigos"
                    icone={<Amigos cor={colors.roxo.escuro}/>}
                    text="Conecte-se e compita com seus amigos"
                />

                <CardSplashInicial
                    title="Loja"
                    icone={<Loja cor={colors.roxo.lilas}/>}
                    text="Personalize seu avatar com itens exclusivos"
                />
            </View>

            <View style={styles.containerBotoes}>
                <ActionButton
                    text="Entrar"
                    onPress={() => router.push("/login")}
                    cor="verde"
                />

                <ActionButton
                    text="Criar conta"
                    onPress={() => router.push("/cadastro")}
                    cor="cinza"
                />
            </View>

            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.preto.padrao,
        flex:1,
        paddingHorizontal: "10%",
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20
    },
    containerCards:{
        gap: 15,
        width: '100%'
    },
    containerBotoes:{
        width: '100%',
    }
});