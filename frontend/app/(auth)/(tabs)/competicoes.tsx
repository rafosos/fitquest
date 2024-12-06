import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useSession } from '@/app/ctx';
import Campeonato from '@/classes/campeonato';
import AddCampeonatoModal from '@/components/AddCampeonatoModal';
import CampeonatoService from '@/services/campeonato_service';
import { colors } from '@/constants/Colors';
import DetalhesCampeonatoModal from '@/components/DetlhesCampeonatoModal';
import StyledText from '@/components/base/styledText';
import { fonts } from '@/constants/Fonts';
import { showDiaMes } from '@/utils/functions';

export default function TabEventos() {
    const [addModal, setAddModal] = useState(false);
    const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [detalhesModal, setDetalhesModal] = useState({show: false, campeonato_id:0});
    const { id: userId } = JSON.parse(useSession().user ?? "{id: null}");

    const campeonatoService = CampeonatoService();

    useEffect(() => 
    refreshCampeonatos(), []);

    const refreshCampeonatos = () => {
        if(!userId) return;
        
        setRefreshing(true);
        campeonatoService.getCampeonatos(userId)
            .then(res => setCampeonatos(res))
            .catch(err => console.log(err))
            .finally(() => setRefreshing(false));
    }
  
    const onCloseModal = () => {
        setAddModal(false);
        setDetalhesModal({show:false, campeonato_id: 0});
        refreshCampeonatos();
        // show smth for user, some feedback
    }

    const abrirModal = () => setAddModal(true);

    const getProgres = (dataInicial:Date, dataFinal:Date) => {
        const totalDias = datediff(dataInicial, dataFinal);
        const diasAteFinal = datediff(dataFinal, new Date());

        return 1 - (((diasAteFinal * 100) / totalDias) / 100);
    }

    const datediff = (first: Date, second: Date) => {        
        return Math.abs(Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)));
    }

    return (<>
        <AddCampeonatoModal
            isVisible={addModal}
            onClose={onCloseModal}
        />

        <DetalhesCampeonatoModal 
            isVisible={detalhesModal.show}
            campeonatoId={detalhesModal.campeonato_id}
            onClose={onCloseModal}
        />

        <FlatList 
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshCampeonatos}/>}
            data={campeonatos}
            contentContainerStyle={styles.containerCampeonatos}
            ListHeaderComponent={
                <View style={styles.header}>
                    <StyledText style={styles.titulo}>Campeonatos</StyledText>
                    <TouchableOpacity style={styles.botaoAdd} onPress={() => setAddModal(true)}>
                        <Ionicons name="add-circle" style={styles.iconeAdd} />
                    </TouchableOpacity>
                </View>
            }
            renderItem={({item:campeonato}) =>
                <TouchableOpacity style={styles.card} onPress={() => setDetalhesModal({show: true, campeonato_id: campeonato.id})}>
                    <StyledText style={styles.nomeCampeonato}>{campeonato.nome}</StyledText>
                    <View style={styles.containerCriadoCampeonato}>
                        <StyledText style={styles.itemCompeticao}>Criado por: <StyledText>{campeonato.id_criador == userId ? "você" : campeonato.username_criador}</StyledText></StyledText>
                        <StyledText style={styles.itemCompeticao}>Criado em: <StyledText>{showDiaMes(campeonato.data_criacao)}</StyledText></StyledText>
                    </View>
                    <StyledText style={styles.itemCompeticao}>Participantes: <StyledText>você{!!campeonato.participantes ? `,${campeonato.participantes}` : ""}</StyledText></StyledText>
                    <View style={styles.containerCriadoCampeonato}>
                        <StyledText style={styles.txtProgresso}>Progresso: </StyledText>
                        <Progress.Bar
                            style={styles.progressBar}
                            color={colors.verde.padrao} 
                            width={null} 
                            progress={getProgres(new Date(campeonato.data_criacao), new Date(campeonato.duracao))} 
                        />
                    </View>
                </TouchableOpacity>
            }
            ListEmptyComponent={
                <TouchableOpacity onPress={abrirModal} style={styles.containerSemCampeonatos}>
                    <StyledText style={styles.textoSemCampeonatos}>Nenhum campeonato encontrado, clique para adicionar um novo!</StyledText>
                    <AntDesign name="plus" style={styles.iconeAddCampeonato} />
                </TouchableOpacity>
            }
        />
    </>);
}

const styles = StyleSheet.create({
    containerCampeonatos:{
        flex:1,
        padding:14,
        backgroundColor: colors.cinza.background
    },
    header:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    titulo:{
        color: colors.branco.padrao,
        fontSize: 25,
        fontFamily: fonts.padrao.Bold700
    },
    botaoAdd: {
        backgroundColor: colors.cinza.medio,
        borderRadius: 25,
        flexDirection: "row",
        paddingHorizontal: 5,
        alignItems: "center"
    },
    textoAdd:{
        fontFamily: fonts.padrao.Regular400
    },
    iconeAdd:{
        fontSize: 24,
        color: colors.preto.padrao,
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
    containerSemCampeonatos:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    textoSemCampeonatos:{
        fontSize: 18,
        color: colors.branco.padrao,
        textAlign: 'center'
    },
    iconeAddCampeonato:{
        fontSize: 30,
        color: colors.branco.padrao,
        backgroundColor: colors.cinza.claro,
        padding: 10,
        borderRadius: 25,
        marginTop: 5
    }
})
  