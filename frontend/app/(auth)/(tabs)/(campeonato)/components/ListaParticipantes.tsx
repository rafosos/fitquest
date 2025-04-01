import { useSession } from "@/app/ctx";
import { UserProgresso } from "@/classes/campeonato";
import StyledText from "@/components/base/styledText";
import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

interface Props{
    progresso: UserProgresso[]
}

export default function ListaParticipantes({progresso, }: Props){
    const userId = Number(useSession().id);

    const abrirTelaAmigo = (amigoId: number | undefined) => 
        amigoId == userId ?
            router.navigate({pathname: '/(auth)/(tabs)/'})
            : router.navigate({pathname: '/(auth)/perfil', params:{userId: amigoId}});
    
    return (
        <FlatList
            data={progresso}
            onStartShouldSetResponder={() => true}
            renderItem={({item, index}) => 
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.containerItem} 
                    onPress={() => abrirTelaAmigo(item.user_id)}
                >
                    <View>
                        <StyledText style={[styles.indexParticipante, index == 0 && styles.indexDourado]}>{index+1}</StyledText>
                    </View>

                    <View style={[styles.card, styles.headerCard]}>
                        <View style={styles.containerColumn}>
                            <View style={styles.containerUsername}>
                                {index == 0 && <FontAwesome5 name="crown" style={styles.iconeCoroa} />}
                                <StyledText style={styles.username}>{item.username}</StyledText>
                            </View>
                            <StyledText style={styles.fullname}>{item.fullname}</StyledText>
                        </View>

                        <View style={styles.containerColumn}>
                            <StyledText style={[styles.numeroTreinos, index == 0 && styles.indexDourado]}>{item.pontos}</StyledText>
                            <StyledText style={[index == 0 && styles.indexDourado]}>pontos</StyledText>
                        </View>
                    </View>
                </TouchableOpacity>
            }
            ListEmptyComponent={<StyledText style={styles.txtListEmpty}>Faça um treino para aparecer na lista!</StyledText>}
        />
    )
}

const styles = StyleSheet.create({
    containerItem:{
        flexDirection: "row",
        marginLeft: 5,
        alignItems: "center"
    },
    indexParticipante:{
        color: colors.branco.padrao
    },
    indexDourado:{
        color: colors.dourado.padrao
    },
    card:{
        borderWidth: 1,
        flexGrow: 1,
        borderColor: colors.preto.padrao,
        backgroundColor: colors.branco.padrao,
        padding: 10,
        margin: 10,
        borderRadius: 4
    },
    headerCard:{
        flexDirection: "row",
        justifyContent: "space-between",
    },
    containerColumn:{
        flexDirection: "column"
    },
    containerUsername:{
        flexDirection: "row",
        alignItems: 'center'
    },
    iconeCoroa:{
        color:colors.dourado.padrao,
        marginRight: 5
    },
    username:{
        fontSize: 18,
        fontFamily: fonts.padrao.Bold700
    },
    fullname:{
        fontSize: 14,
        fontFamily: fonts.padrao.Regular400,
        color: colors.cinza.escuro
    },    
    numeroTreinos: {
        textAlign: "center", 
        fontSize: 20, 
        fontFamily: fonts.padrao.Bold700
    },
    txtListEmpty:{
        color: colors.branco.padrao,
        textAlign: 'center',
        marginTop: 15
    }
})