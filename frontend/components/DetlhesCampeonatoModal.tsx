import { View, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { AntDesign, Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { useSession } from '@/app/ctx';
import { errorHandlerDebug } from '@/services/service_config';
import { colors } from '@/constants/Colors';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { CampeonatoDetalhes, UserProgresso } from '@/classes/campeonato';
import CampeonatoService from '@/services/campeonato_service';
import StyledText from './base/styledText';
import { fonts } from '@/constants/Fonts';
import { showDiaMes } from '@/utils/functions';
import { HeaderPaginaDetalhes } from './base/headerModalPaginaDetalhes';
import ModalPaginaDetalhes from './base/modalPaginaDetalhes';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    campeonatoId: number;
}

export default function DetalhesCampeonatoModal({ isVisible, onClose, campeonatoId}: Props) {
    const [campeonato, setCampeonato] = useState<CampeonatoDetalhes>();
    const [progresso, setProgresso] = useState<UserProgresso[]>([]);
    const [novoTreino, setNovoTreino] = useState(false);
    const [checkboxes, setCheckboxes] = useState<boolean[]>([]);
    const [modalConfirma, setModalConfirma] = useState(false);
    const [index, setIndex] = useState(0);
    const [routes] = useState([{key: "exercicios", title: "Exercícios"}, {key: 'participantes', title: "Participantes"}]);
    const campeonatoService = CampeonatoService();
    const {id:userId} = JSON.parse(useSession().user ?? "{id:null}");
    const layout = useWindowDimensions();

    useEffect(() => refresh(), [campeonatoId]);
    
    const refresh = () => {
        if (!campeonatoId) return
        getDetalhes();
        getProgresso();
    }
    
    const getDetalhes = () =>
        campeonatoService.getCampeonatoDetalhes(userId, campeonatoId)
            .then(res => setCampeonato(res))
            .catch(err => errorHandlerDebug(err));
    
    const getProgresso = () => 
        campeonatoService.getDetalhesProgresso(campeonatoId)
            .then(res => setProgresso(res))
            .catch(err => errorHandlerDebug(err));

    const iniciarNovoTreino = () => {
        setIndex(0);
        setNovoTreino(true);
    }

    const cancelarTreino = () => {
        setNovoTreino(false);
        setCheckboxes([]);
    }

    const clearAndClose = () => {
        setNovoTreino(false);
        setCheckboxes([]);
        setModalConfirma(false);
        setIndex(0);
        onClose();
    }

    const finalizarTreino = () => {
        campeonatoService.addTreino({
            campeonatoId, 
            userId,
            exercicios_ids: campeonato?.exercicios?.filter((e, i) => checkboxes[i]).map(e => e.id).filter(e => e != undefined) ?? []
        })
            .then(res => clearAndClose())
            .catch(err => errorHandlerDebug(err))
    }

    const checkExercicio = (value: boolean, index: number) => {
        checkboxes[index] = value;
        setCheckboxes([...checkboxes]);
    }

    const deletar = () => {
        if (!campeonato) return
        campeonatoService.deleteCampeonato(campeonato.id)
            .then(res => clearAndClose())
            .catch(err => errorHandlerDebug(err))
    }

    const datediff = (destino: Date, hoje: Date) => {
        return Math.round((destino.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    }

    const getDiasRestantes = () => {
        if (!campeonato?.duracao) return "...";
        const dias = datediff(new Date(campeonato.duracao), new Date());
        if (dias < 0) return "encerrado";
        else return `${dias} dias`;
    }

    return (
        <ModalPaginaDetalhes
            visible={isVisible}
            close={clearAndClose}
            modalConfirmacaoProps={{
                show: modalConfirma,
                onConfirma: deletar,
                onClose: () => setModalConfirma(false),
                titulo: `Você tem certeza que deseja excluir o campeonato ${campeonato?.nome}?`,
                subtitulo: "Essa ação não poderá ser desfeita",
                botaoConfirmar:
                    <TouchableOpacity onPress={deletar} style={styles.botaoDeletar}>
                        <Feather name="trash-2" style={styles.iconeDeletar} />
                        <StyledText style={styles.txtBotaoDeletar}>EXCLUIR</StyledText>
                    </TouchableOpacity>
            }}
        > 
            <HeaderPaginaDetalhes 
                titulo={campeonato?.nome ?? "..."}
                onClose={onClose}
                onDelete={() => setModalConfirma(true)}
            />

            {!novoTreino && <> 
                <View style={styles.infoContainer}>
                    <View style={styles.itemInfo}>
                        <StyledText style={styles.txtCardHeader}>Dia final</StyledText>
                        <StyledText style={styles.title}>{showDiaMes(campeonato?.duracao)}</StyledText>
                    </View>
                    <View style={styles.itemInfo}>
                        <StyledText style={styles.txtCardHeader}>Dias restantes</StyledText>
                        <StyledText style={styles.title}>{getDiasRestantes()}</StyledText>
                    </View>
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.itemInfo}>
                        <StyledText style={styles.txtCardHeader}>Treinos</StyledText>
                        <StyledText style={styles.title}>{progresso.find(u => u.user_id == userId)?.dias ?? "..."}</StyledText>
                    </View>
                    
                    <View style={styles.itemInfo}>
                        <StyledText style={styles.txtCardHeader}>Último treino</StyledText>
                        <StyledText style={styles.title}>{showDiaMes(campeonato?.ultimo_treino)}</StyledText> 
                    </View>
                </View>
            </>}

            {novoTreino ? 
                <TouchableOpacity style={styles.botaoTreino} onPress={finalizarTreino}>
                    <Entypo name="controller-stop" style={styles.iconeBotaoTreino} />
                    <StyledText style={styles.txtBotaoNovoTreino}>FINALIZAR TREINO</StyledText>
                </TouchableOpacity>
            :
                <TouchableOpacity style={styles.botaoTreino} onPress={iniciarNovoTreino}>
                    <Entypo name="controller-play" style={styles.iconeBotaoTreino} />
                    <StyledText style={styles.txtBotaoNovoTreino}>INICIAR TREINO</StyledText>
                </TouchableOpacity>
            }

            <TabView
                navigationState={{index, routes}}
                onIndexChange={setIndex}
                lazy={({ route }) => route.title === 'participantes'}
                initialLayout={{width: layout.width}}
                swipeEnabled={!novoTreino}
                renderTabBar={(props) => 
                    (novoTreino && props.navigationState.index == 0) ? <></> :
                    <TabBar 
                        {...props}
                        style={styles.tabs}
                        indicatorStyle={styles.tabIndicator}
                        activeColor={colors.verde.padrao}
                        inactiveColor={colors.branco.padrao}
                    />
                }
                renderScene={SceneMap({
                    exercicios: () => 
                        <FlatList
                            data={campeonato?.exercicios}
                            contentContainerStyle={novoTreino ? styles.containerNovoTreino : styles.container}
                            onStartShouldSetResponder={() => true}
                            renderItem={({item, index}) => 
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.containerItem} 
                                    onPress={() => novoTreino ? checkExercicio(!checkboxes[index], index) : null}
                                >
                                    {novoTreino && 
                                        <View style={styles.containerCheckbox}>
                                            <Checkbox 
                                                value={checkboxes[index]}
                                                onValueChange={(value) => checkExercicio(value, index)}
                                            />
                                        </View>
                                    }

                                    <View style={styles.card}>
                                        <View style={styles.headerCard}>
                                            <View style={styles.containerColumn}>
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
                        />,

                    participantes: () => 
                        <FlatList
                            data={progresso}
                            onStartShouldSetResponder={() => true}
                            renderItem={({item, index}) => 
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.containerItem} 
                                    onPress={() => null}
                                >
                                    <View>
                                        <StyledText style={[styles.indexParticipante, index == 0 && styles.indexDourado]}>{index+1}</StyledText>
                                    </View>

                                    <View style={[styles.card, styles.headerCard]}>
                                        <View style={styles.containerColumn}>
                                            <View style={styles.containerUsername}>
                                                {index == 0 && <FontAwesome5 name="crown" style={styles.iconeCoroa} />}
                                                <StyledText style={styles.tituloExercicio}>{item.username}</StyledText>
                                            </View>
                                            <StyledText style={styles.subTituloExercicio}>{item.fullname}</StyledText>
                                        </View>

                                        <View style={styles.containerColumn}>
                                            <StyledText style={[styles.numeroTreinos, index == 0 && styles.indexDourado]}>{item.dias}</StyledText>
                                            <StyledText style={[index == 0 && styles.indexDourado]}>treinos</StyledText>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            }
                        />
                    })
                }
            />
        
            {novoTreino &&
            <View style={styles.footerTreino}>
                <TouchableOpacity style={[styles.botaoFooter, styles.botaoFooterCancelar]} onPress={cancelarTreino}>
                    <AntDesign name="close" style={styles.iconeBotaoTreino} />
                    <StyledText style={styles.txtBotaoNovoTreino}>CANCELAR</StyledText>
                </TouchableOpacity>
            
                <TouchableOpacity style={styles.botaoFooter} onPress={finalizarTreino}>
                    <Entypo name="controller-stop" style={styles.iconeBotaoTreino} />
                    <StyledText style={styles.txtBotaoNovoTreino}>FINALIZAR TREINO</StyledText>
                </TouchableOpacity>
            </View>}
        </ModalPaginaDetalhes>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: colors.cinza.background,
        padding: 5,
        flex:1,
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
        paddingHorizontal: 5
    },
    containerNovoTreino:{
        paddingHorizontal: 5
    },
    txtCardHeader:{
        color: colors.branco.padrao
    },
    title: {
        fontSize: 16,
        color: colors.branco.padrao,
        fontFamily: fonts.padrao.Bold700,
        textAlign: "center"
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
        margin:5,
        borderRadius: 4,
    },
    botaoTreino:{
        marginVertical: 15,
        padding: 5,
        borderRadius: 15,
        flexDirection: "row",        
        backgroundColor: colors.verde.padrao,
        alignItems: "center",
        justifyContent: "center"
    },
    txtBotaoNovoTreino:{
        color: colors.branco.padrao,
        fontSize: 15,
        textAlignVertical: "center",
    },
    iconeBotaoTreino:{
        color: colors.branco.padrao,
        fontSize: 20,
        marginRight: 10
    },
    tabs:{
        backgroundColor: colors.cinza.background,
    },
    tabIndicator:{
        backgroundColor: colors.verde.padrao
    },
    containerItem:{
        flexDirection: "row",
        marginLeft: 5,
        alignItems: "center"
    },
    indexParticipante:{
        color: colors.branco.padrao
    },
    containerCheckbox:{
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
    },
    cardParticipantes:{
        flexDirection: 'row'
    },
    numeroTreinos: {
        textAlign: "center", 
        fontSize: 20, 
        fontFamily: fonts.padrao.Bold700
    },
    indexDourado:{
        color: colors.dourado.padrao
    },
    footerTreino:{
        flexDirection: "row",
        justifyContent: "space-between"    
    },
    botaoFooter:{
        flex:1,
        marginVertical: 15,
        marginHorizontal: 5,
        padding: 5,
        paddingHorizontal: 20,
        borderRadius: 15,
        flexDirection: "row",        
        backgroundColor: colors.verde.padrao,
        alignItems: "center",
        justifyContent: "center"
    },
    botaoFooterCancelar:{
        backgroundColor: colors.cinza.medio2
    }
});
  