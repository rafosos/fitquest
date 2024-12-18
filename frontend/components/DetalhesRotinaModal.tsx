import { useSession } from '@/app/ctx';
import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import RotinaService from '@/services/rotina_service';
import { RotinaDetalhes } from '@/classes/rotina';
import { errorHandlerDebug } from '@/services/service_config';
import { colors } from '@/constants/Colors';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import StyledText from './base/styledText';
import { fonts } from '@/constants/Fonts';
import { showDiaMes } from '@/utils/functions';
import { HeaderPaginaDetalhes } from './base/headerModalPaginaDetalhes';
import ModalPaginaDetalhes from './base/modalPaginaDetalhes';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    rotinaId: number;
}

export default function DetalhesRotinaModal({ isVisible, onClose, rotinaId}: Props) {
    const [rotina, setRotina] = useState<RotinaDetalhes>();
    const [novoTreino, setNovoTreino] = useState(false);
    const [checkboxes, setCheckboxes] = useState<boolean[]>([]);
    const [modalConfirma, setModalConfirma] = useState(false);
    const rotinaService = RotinaService();
    const {id:userId} = JSON.parse(useSession().user ?? "{id:null}");

    useEffect(() => refresh(), [rotinaId]);
    
    const refresh = () => {
        rotinaService.getDetalhesRotina(userId, rotinaId)
            .then(res => setRotina(res))
            .catch(err => errorHandlerDebug(err))
    }

    const iniciarNovoTreino = () => {
        setNovoTreino(true);
    }

    const cancelarTreino = () => {
        setNovoTreino(false);
        setCheckboxes([]);
    }

    const clearAndClose = () => {
        setNovoTreino(false);
        setCheckboxes([]);
        onClose();
    }

    const finalizarTreino = () => {
        rotinaService.addTreino({
            rotinaId, 
            userId, 
            ids_exercicios: rotina?.exercicios.filter((e, i) => checkboxes[i]).map(e => e.id) ?? []
        })
            .then(res => clearAndClose())
            .catch(err => errorHandlerDebug(err))
    } 

    const checkExercicio = (value: boolean, index:number) => {
        checkboxes[index] = value;
        setCheckboxes([...checkboxes]);
    }

    const deletar = () => {
        rotinaService.deletarRotina(rotinaId)
            .then(res => clearAndClose())
            .catch(err => errorHandlerDebug(err));
    }

    return (
        <ModalPaginaDetalhes
            visible={isVisible}
            close={clearAndClose}
            modalConfirmacaoProps={{
                show: modalConfirma,
                onConfirma: deletar,
                onClose: () => setModalConfirma(false),
                titulo: `Você tem certeza que deseja excluir a rotina ${rotina?.nome}?`,
                subtitulo:"Essa ação não poderá ser desfeita",
                botaoConfirmar: 
                    <TouchableOpacity onPress={deletar} style={styles.botaoDeletar}>
                        <Feather name="trash-2" style={styles.iconeDeletar} />
                        <StyledText style={styles.txtBotaoDeletar}>EXCLUIR</StyledText>
                    </TouchableOpacity>                
            }}
        >
            <FlatList
                data={rotina?.exercicios}
                contentContainerStyle={novoTreino ? styles.containerNovoTreino : styles.container}
                ListHeaderComponent={<>
                    <HeaderPaginaDetalhes 
                        titulo={rotina?.nome ?? "..."}
                        onClose={clearAndClose}
                        onDelete={() => setModalConfirma(true)}
                        showDelete={!novoTreino}
                    />
                    
                    {!novoTreino && <> 
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
                </>}
                renderItem={({item, index}) => 
                    <TouchableOpacity
                        activeOpacity={1} 
                        style={styles.containerExercicio} 
                        onPress={() => novoTreino ? checkExercicio(!checkboxes[index], index) : null}
                    >
                        {novoTreino && 
                            <View>
                                <Checkbox 
                                    value={checkboxes[index]}
                                    onValueChange={(value) => checkExercicio(value, index)}
                                />
                            </View>
                        }

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
                ListFooterComponent={novoTreino ?
                    <View style={styles.footerTreino}>
                        <TouchableOpacity style={[styles.botaoFooter]} onPress={cancelarTreino}>
                            <AntDesign name="close" style={styles.iconeBotaoTreino} />
                            <StyledText style={styles.txtBotaoNovoTreino}>CANCELAR</StyledText>
                        </TouchableOpacity>
                    
                        <TouchableOpacity style={[styles.botaoFooter, {backgroundColor: colors.verde.padrao}]} onPress={finalizarTreino}>
                            <Entypo name="controller-stop" style={styles.iconeBotaoTreino} />
                            <StyledText style={styles.txtBotaoNovoTreino}>FINALIZAR TREINO</StyledText>
                        </TouchableOpacity>
                    </View>
                :<></>}
            />
    </ModalPaginaDetalhes>
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
    containerNovoTreino:{
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
        backgroundColor: colors.cinza.medio2,
        alignItems: "center",
        justifyContent: "center"
    }
});
  