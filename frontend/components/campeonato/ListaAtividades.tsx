import { useSession } from "@/app/ctx";
import { Atividade } from "@/classes/campeonato";
import StyledText from "@/components/base/styledText";
import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import { showDiaMes } from "@/utils/functions";
import { router } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

interface Props{
    atividades: Atividade[]
}

export default function ListaAtividades({atividades}: Props){
    const userId = Number(useSession().id);

    const abrirTelaAmigo = (amigoId: number | undefined) => 
        amigoId == userId ?
            router.navigate({pathname: '/(auth)/(tabs)/'})
            : router.navigate({pathname: '/(auth)/perfil', params:{userId: amigoId}});
    
    return(
        <FlatList
            data={atividades}
            renderItem={({item}) => 
                <View style={styles.card}>
                    <View style={styles.col}>
                        <StyledText onPress={() => abrirTelaAmigo(item.user_id)} style={styles.username}>{item.username}</StyledText>
                        <StyledText style={styles.fullname}>{item.fullname}</StyledText>
                    </View>

                    <View style={styles.containerPontosData}>
                        <StyledText>{item.pontos} pontos</StyledText>
                        <StyledText style={styles.data}>{showDiaMes(item.data)}</StyledText>
                    </View>
                </View>
            }
        />
    )
}

const styles = StyleSheet.create({
    card:{
        flexDirection: 'row',
        borderWidth: 1,
        flexGrow: 1,
        borderColor: colors.preto.padrao,
        backgroundColor: colors.branco.padrao,
        padding: 10,
        margin: 10,
        borderRadius: 4,
        justifyContent: 'space-between'
    },
    col:{
        flexDirection: "column"
    },
    containerPontosData:{
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    username:{
        fontSize: 17,
        fontFamily: fonts.padrao.Bold700
    },
    fullname:{
        fontSize: 13
    },
    data:{
        textAlign: 'right',
        fontFamily: fonts.padrao.Light300,
        fontSize: 13
    }
});