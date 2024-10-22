import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useEffect, useState } from 'react';
import { AntDesign, Entypo } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { useSession } from '@/app/ctx';
import { errorHandlerDebug } from '@/services/service_config';
import { colors } from '@/constants/Colors';
import { CampeonatoDetalhes } from '@/classes/campeonato';
import CampeonatoService from '@/services/campeonato_service';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    campeonatoId: number;
}

export default function DetalhesCampeonatoModal({ isVisible, onClose, campeonatoId}: Props) {
    const [campeonato, setCampeonato] = useState<CampeonatoDetalhes>();
    const [novoTreino, setNovoTreino] = useState(false);
    const [checkboxes, setCheckboxes] = useState<boolean[]>([]);
    const campeonatoService = CampeonatoService();
    const {id:userId} = JSON.parse(useSession().user ?? "{id:null}");

    useEffect(() => refresh(), [campeonatoId]);
    
    const refresh = () => {
        if (!campeonatoId) return
        campeonatoService.getCampeonatoDetalhes(campeonatoId)
            .then(res => setCampeonato(res))
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
        campeonatoService.addTreino({
            campeonatoId, 
            userId,
            exercicios_ids: campeonato?.exercicios?.filter((e, i) => checkboxes[i]).map(e => e.id).filter(e => e != undefined) ?? []
        })
            .then(res => clearAndClose())
            .catch(err => errorHandlerDebug(err))
    }

    const showDiaMes = (data:Date|null|undefined) => data ? `${data.getDate()}/${data.getMonth()}` : "";

    const checkExercicio = (value: boolean, index: number) => {
        checkboxes[index] = value;
        setCheckboxes([...checkboxes])
    }

    return (
        <Modal
            animationType="slide" 
            transparent
            visible={isVisible}
            onRequestClose={() => clearAndClose()}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={styles.modalWrapper}
                onPressOut={clearAndClose}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <FlatList
                            data={campeonato?.exercicios}
                            contentContainerStyle={novoTreino ? styles.containerNovoTreino : styles.container}
                            onStartShouldSetResponder={() => true}
                            ListHeaderComponent={<>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>{campeonato?.nome}</Text>
                                </View>
                                
                                {!novoTreino && <> 
                                    <View style={styles.itemInfo}>
                                        <Text>Duração</Text>
                                        <Text style={styles.title}>{`${campeonato?.duracao}`}</Text>
                                    </View>
                                <View style={styles.infoContainer}>
                                    <View style={styles.itemInfo}>
                                        <Text>Sequência</Text>
                                        <Text style={styles.title}>sla</Text>
                                    </View>
                                    
                                    <View style={styles.itemInfo}>
                                        <Text>Último treino</Text>
                                        <Text style={styles.title}>
                                            {/* {showDiaMes(campeonato?.ultimoTreino)}
                                            */}
                                            sla</Text> 
                                    </View>
                                </View>
                                </>}

                                {novoTreino ? 
                                    <TouchableOpacity style={styles.botaoTreino} onPress={finalizarTreino}>
                                        <Entypo name="controller-stop" style={styles.iconeBotaoTreino} />
                                        <Text style={styles.txtBotaoNovoTreino}>Finalizar treino</Text>
                                    </TouchableOpacity>
                                :
                                    <TouchableOpacity style={styles.botaoTreino} onPress={iniciarNovoTreino}>
                                        <Entypo name="controller-play" style={styles.iconeBotaoTreino} />
                                        <Text style={styles.txtBotaoNovoTreino}>Iniciar treino</Text>
                                    </TouchableOpacity>
                                }
                            </>}
                            renderItem={({item, index}) => 
                                <TouchableOpacity
                                    activeOpacity={0}
                                    style={styles.containerExercicio} 
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

                                    <View style={styles.cardExercicio}>
                                        <View style={styles.headerCard}>
                                            <View style={styles.containerTituloExercicio}>
                                                <Text style={styles.tituloExercicio}>{item.nome}</Text>
                                                <Text style={styles.subTituloExercicio}>{item.grupo_muscular_nome}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.containerCamposExec}>
                                            <View style={styles.containerTxtCard}>
                                                <Text style={styles.txtCard}>Séries: </Text>
                                                <Text>{item.qtd_serie.toString()}</Text>
                                            </View>

                                            <View style={styles.containerTxtCard}>
                                                <Text style={styles.txtCard}>Repetições: </Text>
                                                <Text>{item.qtd_repeticoes.toString()}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            }
                            ListFooterComponent={novoTreino ?
                                <View style={styles.footerTreino}>
                                    <TouchableOpacity style={styles.botaoFooter} onPress={cancelarTreino}>
                                        <AntDesign name="close" style={styles.iconeBotaoTreino} />
                                        <Text style={styles.txtBotaoNovoTreino}>Cancelar</Text>
                                    </TouchableOpacity>
                                
                                    <TouchableOpacity style={styles.botaoFooter} onPress={finalizarTreino}>
                                        <Entypo name="controller-stop" style={styles.iconeBotaoTreino} />
                                        <Text style={styles.txtBotaoNovoTreino}>Finalizar treino</Text>
                                    </TouchableOpacity>
                                </View>
                            :<></>}
                        />
                  </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalWrapper: {
        flex:1,
        backgroundColor: colors.preto.fade[5],
        alignItems: "center",
        justifyContent: "center"
    },
    modalContent: {
        marginVertical: "10%",
        backgroundColor: colors.branco.padrao,
        borderRadius: 18,
        padding: 5,
        flex:1,
        width: "90%"
    },
    container:{
        paddingHorizontal: 5
    },
    containerNovoTreino:{
        paddingHorizontal: 5
    },
    titleContainer: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center"
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    itemInfo:{
        borderWidth: 1,
        borderColor: colors.preto.padrao,
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
        backgroundColor: colors.cinza.escuro,
        alignItems: "center",
        justifyContent: "center"
    },
    txtBotaoNovoTreino:{
        color: colors.branco.padrao,
        fontSize: 18,
        textAlignVertical: "center"
        // textTransform: "uppercase"
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
    containerCheckbox:{
    },
    cardExercicio:{
        borderWidth: 1,
        flexGrow: 1,
        borderColor: colors.preto.padrao,
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
        fontWeight: "800"
    },
    subTituloExercicio:{
        fontSize: 14,
        fontWeight: "300",
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
        borderRadius: 15,
        flexDirection: "row",        
        backgroundColor: colors.cinza.escuro,
        alignItems: "center",
        justifyContent: "center"
    }
});
  