import { Entypo, Feather } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { RotinaDetalhes } from "@/classes/rotina";
import { HeaderPaginaDetalhes } from "@/components/base/headerModalPaginaDetalhes";
import StyledText from "@/components/base/styledText";
import ModalConfirmacao from "@/components/ModalConfirmacao";
import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import RotinaService from "@/services/rotina_service";
import { ErrorHandler } from "@/utils/ErrorHandler";
import { showDiaMes } from "@/utils/functions";

export default function DetalhesRotina(){
    const [rotina, setRotina] = useState<RotinaDetalhes>();
    const [modalConfirma, setModalConfirma] = useState(false);
    const [loading, setLoading] = useState(false);
    const rotinaService = RotinaService();

    const errorHandler = ErrorHandler();
    const rotinaId = Number(useLocalSearchParams().rotinaId);

    useEffect(() => refresh(), [rotinaId]);

    const navigation = useNavigation<BottomTabNavigationProp<any>>();
    useEffect(() => {
        navigation.getParent("/(auth)/(tabs)")?.setOptions({ tabBarStyle: { display: 'none' } });
        return () => {
        navigation.getParent("/(auth)/(tabs)")?.setOptions({ tabBarStyle: { display: 'flex' } });
        };
    }, [navigation]);
    
    const refresh = () => {
        setLoading(true);
        rotinaService.getDetalhesRotina(rotinaId)
            .then(res => setRotina(res))
            .catch(err => errorHandler.handleError(err))
            .finally(() => setLoading(false));
    }

    const iniciarNovoTreino = () => 
        router.navigate({pathname: "/(auth)/(tabs)/rotina/[rotinaId]/treino", params: {rotinaId, rotinaNome: rotina?.nome}});

    const clearAndClose = () => {
        router.back();
    }

    const deletar = () => {
        rotinaService.deletarRotina(rotinaId)
            .then(res => clearAndClose())
            .catch(err => errorHandler.handleError(err));
    }

    return (
        <>
            <ModalConfirmacao
                show={modalConfirma}
                onConfirma={deletar}
                onClose={() => setModalConfirma(false)}
                titulo={`Você tem certeza que deseja excluir a rotina ${rotina?.nome}?`}
                subtitulo={"Essa ação não poderá ser desfeita"}
                botaoConfirmar={ 
                    <TouchableOpacity onPress={deletar} style={styles.botaoDeletar}>
                        <Feather name="trash-2" style={styles.iconeDeletar} />
                        <StyledText style={styles.txtBotaoDeletar}>EXCLUIR</StyledText>
                    </TouchableOpacity>                
                }
            />
            
            <FlatList
                data={rotina?.exercicios}
                contentContainerStyle={styles.container}
                ListHeaderComponent={<>
                    <HeaderPaginaDetalhes
                        titulo={rotina?.nome ?? "..."}
                        onClose={clearAndClose}
                        onDelete={() => setModalConfirma(true)}
                        showDelete
                    />
                    
                    <View style={styles.infoContainer}>
                        <View style={styles.itemInfo}>
                            <StyledText style={styles.headerInfoTitle}>Dias por semana</StyledText>
                            <StyledText style={styles.valueHeaderInfo}>{rotina?.dias}</StyledText>
                        </View>
                        
                        <View style={styles.itemInfo}>
                            <StyledText style={styles.headerInfoTitle}>Último treino</StyledText>
                            <StyledText style={styles.valueHeaderInfo}>{showDiaMes(rotina?.ultimo_treino)}</StyledText>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.botaoTreino} onPress={iniciarNovoTreino} disabled={loading}>
                        <Entypo name="controller-play" style={styles.iconeBotaoTreino} />
                        <StyledText style={styles.txtBotaoNovoTreino}>INICIAR TREINO</StyledText>
                    </TouchableOpacity>
                </>}
                renderItem={({item}) => 
                    <TouchableOpacity
                        activeOpacity={1} 
                        style={styles.containerExercicio} 
                        onPress={() => null}
                    >
                        <View style={styles.cardExercicio}>
                            <View style={styles.headerCard}>
                                <View style={styles.containerTituloExercicio}>
                                    <StyledText style={styles.tituloExercicio}>{item.nome}</StyledText>
                                    <StyledText style={styles.subTituloExercicio}>{item.grupo_muscular_nome}</StyledText>
                                </View>
                            </View>

                            <View style={styles.containerCamposExec}>
                                <View style={styles.containerTxtCard}>
                                    <StyledText style={styles.txtCard}>Séries: </StyledText>
                                    <StyledText>{item.qtd_serie.toString()}</StyledText>
                                </View>

                                <View style={styles.containerTxtCard}>
                                    <StyledText style={styles.txtCard}>Repetições: </StyledText>
                                    <StyledText>{item.qtd_repeticoes.toString()}</StyledText>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                }
                ListEmptyComponent={loading ? <ActivityIndicator size={"large"} color={colors.verde.padrao} /> : null}
            />
    </>
    );
}

const styles = StyleSheet.create({
    botaoDeletar:{
        flexDirection: "row",
        borderRadius: 15,
        backgroundColor: colors.vermelho.padrao,
        marginHorizontal:20,
        padding:5,
        paddingHorizontal: 20
    },
    txtBotaoDeletar:{
        color:colors.branco.padrao
    },
    iconeDeletar:{
        color:colors.branco.padrao,
        textAlignVertical: 'center',
        marginRight:5
    },
    container:{
        paddingHorizontal: 5,
    },
    headerInfoTitle:{
        color:colors.branco.padrao
    },
    valueHeaderInfo: {
        fontSize: 16,
        fontFamily: fonts.padrao.Bold700,
        textAlign: "center",
        color: colors.branco.padrao
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    itemInfo:{
        borderWidth: 1,
        borderColor: colors.branco.padrao,
        padding: 10,
        flex:1,
        marginHorizontal:5,
        alignItems: 'center',
        borderRadius: 4,
    },
    botaoTreino:{
        marginVertical: 15,
        padding: 5,
        paddingHorizontal: 15,
        borderRadius: 15,
        flexDirection: "row",        
        backgroundColor: colors.verde.padrao,
        alignItems: "center",
        justifyContent: "center"
    },
    txtBotaoNovoTreino:{
        color: colors.branco.padrao,
        textAlignVertical: "center"
    },
    iconeBotaoTreino:{
        color: colors.branco.padrao,
        fontSize: 20,
        marginRight: 10
    },
    containerExercicio:{
        flexDirection: "row",
        marginLeft: 5,
        alignItems: "center"
    },
    cardExercicio:{
        borderWidth: 1,
        flex: 1,
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
    containerTituloExercicio:{
        flexDirection: "column"
    },
    tituloExercicio:{
        fontSize: 18,
        fontFamily: fonts.padrao.Bold700
    },
    subTituloExercicio:{
        fontSize: 14,
        fontFamily: fonts.padrao.Regular400,
        color: colors.cinza.escuro
    },
    containerTxtCard:{
        flex:1,
        flexDirection: "row",
        alignItems: "center"
    },
    txtCard:{
        fontSize: 17
    },
    containerCamposExec: {
        flexDirection: "row"
    }
});
  