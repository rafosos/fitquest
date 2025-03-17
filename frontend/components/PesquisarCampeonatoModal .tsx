import { colors } from "@/constants/Colors"
import { AntDesign, FontAwesome5 } from "@expo/vector-icons"
import * as Progress from 'react-native-progress';
import { ActivityIndicator, FlatList, Modal, StyleSheet, TouchableOpacity, View } from "react-native"
import StyledText from "./base/styledText"
import { fonts } from "@/constants/Fonts"
import StyledTextInput from "./base/styledTextInput"
import { useEffect, useState } from "react"
import CampeonatoService from "@/services/campeonato_service"
import Campeonato from "@/classes/campeonato"
import { useSession } from "@/app/ctx"
import { errorHandlerPadrao, getProgress, showDiaMes } from "@/utils/functions"

interface Props{
    visible: boolean,
    onClose: () => void,
    setDetalhesModal: (prop: {show: boolean, campeonato_id: number}) => void
}

export default function PesquisarCampeonatoModal({visible, onClose, setDetalhesModal}: Props){
    const [texto, setTexto] = useState("");
    const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);
    const campeonatoService = CampeonatoService();
    const {id:userId} = JSON.parse(useSession().username ?? "{id:null}");

    useEffect(() => {
        if(texto)
            getCampeonatos();
        else
            setCampeonatos([]);
    }, [texto]);

    const getCampeonatos = () => {
        setLoading(true);
        campeonatoService.getCampeonatosPesquisa(userId, texto)
            .then(res => setCampeonatos(res))
            .catch(err => errorHandlerPadrao(err,setErro))
            .finally(()=> setLoading(false));
    }

    return (
        <Modal
            animationType="slide" 
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.containerHeader}>
                    <AntDesign name="arrowleft" size={30} color={colors.branco.padrao} onPress={onClose} style={styles.iconeVoltar}/>
                    <StyledText style={styles.txtHeader}>Encontrar campeonatos</StyledText>            
                </View>

                <View style={styles.containerInput}>
                    <StyledTextInput 
                        value={texto}
                        onChangeText={(txt) => setTexto(txt)}
                        style={styles.txtInput}
                        placeholder="Pesquisar campeonato"
                    />

                    {loading ?
                        <ActivityIndicator size={'small'} color={colors.verde.padrao}/>
                        : 
                        <FontAwesome5 name="search" style={styles.iconePesquisar} onPress={getCampeonatos}/>
                    }
                </View>

                <FlatList
                    contentContainerStyle={styles.containerFlatlist}
                    data={campeonatos}
                    renderItem={({item: campeonato}) => 
                        <TouchableOpacity style={styles.card} onPress={() => setDetalhesModal({show: true, campeonato_id: campeonato.id})}>
                            <StyledText style={styles.nomeCampeonato}>{campeonato.nome}</StyledText>
                            <View style={styles.containerCriadoCampeonato}>
                                <StyledText style={styles.itemCompeticao}>Criado por: <StyledText>{campeonato.username_criador}</StyledText></StyledText>
                                <StyledText style={styles.itemCompeticao}>Criado em: <StyledText>{showDiaMes(campeonato.data_criacao)}</StyledText></StyledText>
                            </View>
                            <StyledText style={styles.itemCompeticao}>Participantes: <StyledText>{campeonato.participantes}</StyledText></StyledText>
                            <View style={styles.containerCriadoCampeonato}>
                                <StyledText style={styles.txtProgresso}>Progresso: </StyledText>
                                <Progress.Bar
                                    style={styles.progressBar}
                                    color={colors.verde.padrao} 
                                    width={null} 
                                    progress={getProgress(new Date(campeonato.data_criacao), new Date(campeonato.duracao))} 
                                />
                            </View>
                        </TouchableOpacity>
                    }
                    ListEmptyComponent={
                        <StyledText style={styles.textoSemCampeonatos}>
                            {texto ? 
                            "Não foram encontrados resultados para a pesquisa.": 
                            "Digite algo para pesquisar"}
                        </StyledText>
                    }
                />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.cinza.background,
        padding: 10,
        flex:1
    },
    containerHeader:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconeVoltar:{
        marginRight: 10
    },
    txtHeader:{
        color: colors.branco.padrao,
        fontSize: 25,
        fontFamily: fonts.padrao.Bold700
    },
    containerInput:{
        backgroundColor: colors.branco.padrao,
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 15,
        padding:7,
        paddingHorizontal: 10,
        alignItems: "center"
    },
    txtInput:{
        flex:1
    },
    iconePesquisar:{
        fontSize: 16
    },
    containerFlatlist:{
        flex:1
    },
    card:{
        backgroundColor: colors.branco.padrao,
        borderColor: colors.cinza.escuro,
        borderWidth: 2,
        borderRadius: 25,
        padding: 10,
        marginVertical: 2
    },
    nomeCampeonato:{
        fontSize: 17,
        fontFamily: fonts.padrao.Bold700
    },
    containerCriadoCampeonato:{
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    txtProgresso: {
        fontFamily: fonts.padrao.Light300
    },
    progressBar:{
        marginTop: 8, 
        flex: 1, 
        height: 8
    },
    itemCompeticao:{
        fontFamily: fonts.padrao.Medium500
    },
    textoSemCampeonatos:{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        color: colors.branco.padrao,
        textAlign: 'center'
    }
})