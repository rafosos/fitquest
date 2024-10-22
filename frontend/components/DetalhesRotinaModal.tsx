import { useSession } from '@/app/ctx';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import RotinaService from '@/services/rotina_service';
import { RotinaDetalhes } from '@/classes/rotina';
import { errorHandlerDebug } from '@/services/service_config';
import { colors } from '@/constants/Colors';
import { AntDesign, Entypo } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    rotinaId: number;
}

export default function DetalhesRotinaModal({ isVisible, onClose, rotinaId}: Props) {
    const [rotina, setRotina] = useState<RotinaDetalhes>();
    const [novoTreino, setNovoTreino] = useState(false);
    const [checkboxes, setCheckboxes] = useState<boolean[]>([]);
    const rotinaService = RotinaService();
    const {id:userId} = JSON.parse(useSession().user ?? "{id:null}");

    useEffect(() => refresh(), [rotinaId]);
    
    const refresh = () => {
        rotinaService.getDetalhesRotina(rotinaId)
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
            rotinaId: rotinaId, 
            userId, 
            ids_exercicios: rotina?.exercicios.filter((e, i) => checkboxes[i]).map(e => e.id) ?? []
        })
            .then(res => clearAndClose())
            .catch(err => errorHandlerDebug(err))
    }

    const showDiaMes = (data:Date|null|undefined) => data ? `${data.getDate()}/${data.getMonth()}` : "";

    return (
        <Modal
            animationType="slide" 
            transparent
            visible={isVisible}
            onRequestClose={() => onClose()}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={styles.modalWrapper}
                onPressOut={onClose}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>

                    <FlatList
                        data={rotina?.exercicios}
                        contentContainerStyle={novoTreino ? styles.containerNovoTreino : styles.container}
                        ListHeaderComponent={<>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>{rotina?.nome}</Text>
                            </View>
                            
                            {!novoTreino && <> 
                            <View style={styles.infoContainer}>
                                <View style={styles.itemInfo}>
                                    <Text>Dias por semana</Text>
                                    <Text style={styles.title}>{rotina?.dias}</Text>
                                </View>

                                <View style={styles.itemInfo}>
                                    <Text>Sequência</Text>
                                    <Text style={styles.title}>{rotina?.streak}</Text>
                                </View>
                                
                                <View style={styles.itemInfo}>
                                    <Text>Último treino</Text>
                                    <Text style={styles.title}>{showDiaMes(rotina?.ultimoTreino)}</Text>
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
                            <View style={styles.containerExercicio} onStartShouldSetResponder={() => true}>
                                {novoTreino && 
                                    <Checkbox 
                                        value={checkboxes[index]}
                                        onValueChange={(value) => {
                                            checkboxes[index] = value;
                                            setCheckboxes([...checkboxes])
                                        }}
                                    />
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
                            </View>
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
        justifyContent: "center",
        paddingHorizontal: "5%",
    },
    modalContent: {
      width: '100%',
      height: "90%",
      backgroundColor: colors.branco.padrao,
      borderRadius: 18,
      padding: 5
    },
    container:{
        paddingHorizontal: 5,
        // height: "90%"
    },
    containerNovoTreino:{
        // height: "90%",
        width: "100%",
        flex:1
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
        // marginVertical: 10,
        // marginHorizontal: 5,
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
    cardExercicio:{
        borderWidth: 1,
        flex: 1,
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
  