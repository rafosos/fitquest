import { useSession } from "@/app/ctx";
import { AtividadeDetalhada } from "@/classes/campeonato";
import { HeaderPaginaDetalhes } from "@/components/base/headerModalPaginaDetalhes";
import StyledText from "@/components/base/styledText";
import CardExercicio from "@/components/campeonato/CardExercicio";
import ModalConfirmacao from "@/components/ModalConfirmacao";
import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import CampeonatoService from "@/services/campeonato_service";
import { ErrorHandler } from "@/utils/ErrorHandler";
import { showDiaMes } from "@/utils/functions";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useToast } from "react-native-toast-notifications";

export default function AtividadeDetalhes(){
    const [loading, setLoading] = useState(false);
    const [loadingDeletar, setLoadingDeletar] = useState(false);
    const [atividade, setAtividade] = useState<AtividadeDetalhada>();
    const [modalConfirma, setModalConfirma] = useState(false);

    const toast = useToast();
    const campeonatoService = CampeonatoService();
    const userId = Number(useSession().id);
    const atividadeId = Number(useLocalSearchParams().id);
    const errorHandler = ErrorHandler();

    useEffect(() => {
        setLoading(true);
        campeonatoService.getAtividadeById(atividadeId)
            .then(res => {
                setAtividade(res)
            })
            .catch(err => {
                errorHandler.handleError(err);
                router.back();
            })
            .finally(() => setLoading(false));
    }, []);

    const onDelete = () => setModalConfirma(true);

    const deletarTreino = () => {
        setLoadingDeletar(true);
        campeonatoService.deleteTreino(atividadeId)
            .then(res => {
                toast.show("Atividade deletada com sucesso.", {type: "success"});
                router.back();
            })
            .catch(err => errorHandler.handleError(err))
            .finally(() => setLoadingDeletar(false));
    }
    
    return (<>
        <ModalConfirmacao
            show={modalConfirma}
            onConfirma={deletarTreino}
            loading={loadingDeletar}
            onClose={() => setModalConfirma(false)}
            titulo={`Você tem certeza que deseja excluir o treino?`}
            subtitulo={"Essa ação não poderá ser desfeita."} //será msm q n?
            botaoConfirmar={ 
                <TouchableOpacity onPress={!loadingDeletar ? deletarTreino : () => null} style={styles.botaoDeletar}>
                    {!loadingDeletar ? <>
                        <Feather name="trash-2" style={styles.iconeDeletar} />
                        <StyledText style={styles.txtBotaoDeletar}>EXCLUIR</StyledText>
                    </>: 
                        <ActivityIndicator color={colors.cinza.escuro} size={"small"}/>
                    }
                </TouchableOpacity>
            }
            />
        <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <HeaderPaginaDetalhes
                        titulo={""}
                        onClose={router.back}
                        showSair={false}
                        onDelete={onDelete}
                        showDelete={atividade?.user_id == userId}
                    />
                </View>
                
                {loading ? 
                    <ActivityIndicator style={styles.loading} size={"large"}/>
                :<>
                
                <View style={styles.containerImg}>
                    <Image
                        source={{uri: "data:image/png;base64," + atividade?.imagem}}
                        style={styles.imagem}
                    />
                </View>

                <View style={styles.header}>
                    <View style={styles.col}>
                        <StyledText style={styles.username}>{atividade?.username}</StyledText>
                        <StyledText style={styles.fullname}>{atividade?.fullname}</StyledText>
                    </View>
                
                    <View style={styles.col}>
                        <StyledText style={styles.pontos}>{atividade?.pontos} pontos</StyledText>
                        <StyledText style={styles.data}>{showDiaMes(atividade?.data)}</StyledText>
                    </View>
                </View>

                <StyledText style={styles.titleExercicios}>Exercícios realizados:</StyledText>

                {atividade?.exercicios?.map(item => <CardExercicio key={item.id} item={item}/>) }
                </>}
            </ScrollView>
    </>

        )
}

const styles = StyleSheet.create({
    loading:{
        flex: 1,
        color: colors.verde.padrao
    },
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
        color: colors.branco.padrao,
        textAlignVertical: 'center',
        marginRight:5
    },
    container:{
        marginHorizontal: 10,
    },
    containerImg:{
        alignItems: 'center'
    },
    imagem:{
        marginVertical: 10,
        width: "95%",
        height: "auto",
        aspectRatio: 1,
        borderRadius: 15
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    col:{
        flexDirection: "column",
        justifyContent: 'center' 
    },
    username:{
        fontSize: 23,
        fontFamily: fonts.padrao.Bold700,
        color: colors.branco.padrao
    },
    fullname:{
        fontSize: 13,
        color: colors.branco.padrao
    },
    pontos:{
        color: colors.branco.padrao
    },
    data:{
        textAlign: 'right',
        fontFamily: fonts.padrao.Light300,
        color: colors.branco.padrao,
        fontSize: 13
    },
    titleExercicios:{
        fontFamily: fonts.padrao.Bold700,
        color: colors.branco.padrao,
        marginTop:15,
        fontSize: 20 
    }
});