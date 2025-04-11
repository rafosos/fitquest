import { useSession } from "@/app/ctx";
import { Atividade } from "@/classes/campeonato";
import StyledText from "@/components/base/styledText";
import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import { showDiaMes } from "@/utils/functions";
import { router } from "expo-router";
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface Props{
    atividades: Atividade[],
    abrirAtividade?: (id:number) => void
}

export default function ListaAtividades({atividades, abrirAtividade = (id: number) => null}: Props){
    const userId = Number(useSession().id);

    const abrirTelaAmigo = (amigoId: number | undefined) => 
        amigoId == userId ?
            router.navigate({pathname: '/(auth)/(tabs)/'})
            : router.navigate({pathname: '/(auth)/perfil', params:{userId: amigoId}});
    
    return(
        <FlatList
            data={atividades}
            renderItem={({item}) => 
                <TouchableOpacity style={styles.card} onPress={() => abrirAtividade(item.id)}>
                    <View style={styles.containerImgTitle}>
                        <Image 
                            source={{uri: "data:image/png;base64," + item.imagem}}
                            style={styles.imagem}
                        />
                        <View style={styles.col}>
                            <StyledText onPress={() => abrirTelaAmigo(item.user_id)} style={styles.username}>{item.username}</StyledText>
                            <StyledText style={styles.fullname}>{item.fullname}</StyledText>
                        </View>
                    </View>

                    <View style={styles.containerPontosData}>
                        <StyledText>{item.pontos} pontos</StyledText>
                        <StyledText style={styles.data}>{showDiaMes(item.data)}</StyledText>
                    </View>
                </TouchableOpacity>
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
    containerImgTitle:{
        flexDirection: 'row',
        gap: 10,
    },
    imagem:{
        borderRadius: 25,
        width: 50,
        height: 50
    },
    col:{
        flexDirection: "column",
        justifyContent: 'center' 
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