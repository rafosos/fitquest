import { FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import { AntDesign } from '@expo/vector-icons';
import { useSession } from '@/app/ctx';
import Campeonato from '@/classes/campeonato';
import AddCampeonatoModal from '@/components/AddCampeonatoModal';
import CampeonatoService from '@/services/campeonato_service';
import ActionButton from '@/components/ActionButton';
import { colors } from '@/constants/Colors';
import DetalhesCampeonatoModal from '@/components/DetlhesCampeonatoModal';
import StyledText from '@/components/base/styledText';
import { fonts } from '@/constants/Fonts';

export default function TabEventos() {
    const [addModal, setAddModal] = useState(false);
    const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [detalhesModal, setDetahesModal] = useState({show: false, campeonato_id:0});
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
        setDetahesModal({show:false, campeonato_id: 0})
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
                <StyledText style={styles.titulo}>Campeonatos</StyledText>
            }
            renderItem={({item:campeonato}) =>
                <TouchableOpacity style={styles.card} onPress={() => setDetahesModal({show: true, campeonato_id: campeonato.id})}>
                    <StyledText style={styles.nomeCampeonato}>{campeonato.nome}</StyledText>
                    <StyledText>Participantes: {campeonato.participantes}</StyledText>
                    <StyledText>Criador: {campeonato.nickname_criador}</StyledText>
                    <Progress.Bar color={colors.verde.padrao} width={null} progress={getProgres(new Date(campeonato.data_criacao), new Date(campeonato.duracao))} />
                </TouchableOpacity>
            }
            ListEmptyComponent={
                <TouchableOpacity onPress={abrirModal} style={styles.containerSemCampeonatos}>
                    <StyledText style={styles.textoSemCampeonatos}>Nenhum campeonato encontrado, clique para adicionar um novo!</StyledText>
                    <AntDesign name="plus" style={styles.iconeAddCampeonato} />
                </TouchableOpacity>
            }
        />

        <ActionButton acao={abrirModal}/>
    </>);
}

const styles = StyleSheet.create({
    containerCampeonatos:{
        flex:1,
        padding:14,
        backgroundColor: colors.cinza.background
    },
    titulo:{
        color: colors.branco.padrao,
        fontSize: 25,
        fontFamily: fonts.padrao.Bold700
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
        fontWeight: "700"
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
  