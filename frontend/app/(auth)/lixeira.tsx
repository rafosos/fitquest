import { useSession } from "@/app/ctx";
import User from "@/classes/user";
import { StatusTreino, TipoTreino, TreinoResumo } from "@/classes/user_exercicio";
import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import ExercicioService from "@/services/exercicio_service"
import { errorHandlerDebug } from "@/services/service_config";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import StyledText from "@/components/base/styledText";
import { showDiaMes } from "@/utils/functions";
import { router } from "expo-router";
import ModalConfirmacao from "@/components/ModalConfirmacao";
import ErroInput from "@/components/ErroInput";

export default function Lixeira(){
    const [treinos, setTreinos] = useState<TreinoResumo[]>([]);
    const [erro, setErro] = useState("");
    const [modalConfirma, setModalConfirma] = useState<{show:boolean, treino: TreinoResumo | null}>({show: false, treino: null});
    const [refreshing, setRefreshing] = useState(false);
    const exercicioService = ExercicioService();
    const { user: userString } = useSession();
    const user: User = useRef(JSON.parse(userString ?? "{}")).current;

    useEffect(() => getDeletados(),[]);

    const getDeletados = () => {
        setRefreshing(true);
        exercicioService.getDeletados(user.id)
            .then(res => setTreinos(res))
            .catch(err => {
                errorHandlerDebug(err);
                if (err.response)
                    setErro(err.response.data.detail);
                else
                    setErro(err.message);
            }).finally(()=>setRefreshing(false));
    }
        
    const restaurarTreino = () => {
        setRefreshing(true);
        exercicioService.atualizarStatusTreino(Number(modalConfirma.treino?.id), StatusTreino.ativo)
        .then(res => onCloseModalConfirmacao())
        .catch(err => {
            errorHandlerDebug(err);
            if (err.response)
                setErro(err.response.data.detail);
            else
            setErro(err.message);
        }).finally(()=> setRefreshing(false));
    }

    const onClose =() => {
        router.back();
    }

    const onCloseModalConfirmacao = () => {
        setModalConfirma({show: false, treino: null});
        getDeletados();
    }

    return (
        <FlatList 
            data={treinos}
            contentContainerStyle={s.containerFlatlist}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getDeletados}/>}
            ListHeaderComponent={<>
                <ModalConfirmacao 
                    show={modalConfirma.show}
                    onClose={onCloseModalConfirmacao}
                    onConfirma={restaurarTreino}
                    titulo="Restaurar treino"
                    subtitulo="Deseja restaurar estre treino?"
                    botaoConfirmar={
                        <TouchableOpacity style={s.botaoConfirmarModal} onPress={restaurarTreino}>
                            <AntDesign name="back" size={12} color={colors.branco.padrao} />
                            <StyledText style={s.txtBotao}>CONFIRMAR</StyledText>
                        </TouchableOpacity>
                    }
                />

                <View style={s.headerContainer}>
                    <AntDesign name="arrowleft" onPress={onClose} style={s.iconeVoltar}/>
                    <StyledText style={s.titulo}>Lixeira</StyledText>
                </View>

                <ErroInput
                    show={!!erro}
                    texto={erro}
                />
            </>}
            renderItem={({item}) => 
                <TouchableOpacity style={s.card} onPress={() => setModalConfirma({show:true, treino: item})}>
                    <View style={s.headerCard}>
                        <View>
                            <StyledText style={s.nomeTreino}>{item.nome ?? "Treino"}</StyledText>
                            <StyledText style={s.data}>{showDiaMes(item.data)}</StyledText>
                            <View style={s.chip}>
                                <StyledText style={s.txtChip}>{item.tipo && TipoTreino[item.tipo]}</StyledText>
                            </View>
                        </View>

                        <AntDesign name="back" size={24} color={colors.verde.padrao} />
                    </View>

                    <StyledText>{item.exercicios}</StyledText>
                </TouchableOpacity>
            }
            ListEmptyComponent={<StyledText style={s.txtListEmpty}>Não há treinos excluídos.</StyledText>}
        />

    )
}

const s = StyleSheet.create({
    containerFlatlist:{
        flex:1,
        margin: 10
    },
    botaoConfirmarModal:{
        backgroundColor: colors.verde.padrao,
        paddingHorizontal: 25,
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 15
    },
    txtBotao:{
        color: colors.branco.padrao,
        marginLeft: 5
    },
    headerContainer:{
        alignItems: 'center',
        flexDirection: 'row'
    },
    iconeVoltar:{
        fontSize: 30,
        color: colors.branco.padrao 
    },
    titulo:{
        fontSize: 24,
        marginLeft: 5,
        color: colors.branco.padrao,
        fontFamily: fonts.padrao.Bold700,
        textAlign: "center"
    },
    card:{
        marginVertical: 5,
        borderColor: colors.cinza.escuro,
        backgroundColor: colors.branco.padrao,
        borderWidth: 2,
        borderRadius: 10,
        padding: 10
    },
    cardInformacoesPessoais:{
        flexDirection: 'row',
        justifyContent: "space-between",
        borderRadius: 20,
        paddingHorizontal: 15
    },
    headerCard:{
        flexDirection:"row",
        justifyContent: "space-between"
    },
    nomeTreino:{
        fontFamily: fonts.padrao.SemiBold600
    },
    data:{
        fontSize: 12
    },
    chip:{
    
    },
    txtChip:{
        fontFamily: fonts.padrao.Light300
    },
    txtNenhumaAtividade:{
        color: colors.branco.padrao,
        textAlign: 'center'
    },
    txtListEmpty:{
        color: colors.branco.padrao,
        textAlign: 'center',
        textAlignVertical: 'center',
        flex:1
    }    
})