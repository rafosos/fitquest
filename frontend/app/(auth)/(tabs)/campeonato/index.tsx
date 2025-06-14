import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSession } from '@/app/ctx';
import Campeonato from '@/classes/campeonato';
import AddCampeonatoModal from '@/components/campeonato/AddCampeonatoModal';
import CampeonatoService from '@/services/campeonato_service';
import { colors } from '@/constants/Colors';
import StyledText from '@/components/base/styledText';
import { fonts } from '@/constants/Fonts';
import { getProgress, showDiaMes } from '@/utils/functions';
import PesquisarCampeonatoModal from '@/components/campeonato/PesquisarCampeonatoModal ';

export default function TabEventos() {
    const [addModal, setAddModal] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const userId = Number(useSession().id);

    const campeonatoService = CampeonatoService();

    useEffect(() => refreshCampeonatos(), []);
    

    const refreshCampeonatos = () => {        
        setRefreshing(true);
        campeonatoService.getCampeonatos()
            .then(res => setCampeonatos(res))
            .catch(err => console.log(err))
            .finally(() => setRefreshing(false));
    }
  
    const onCloseModal = () => {
        setAddModal(false);
        refreshCampeonatos();
    }

    const onClosePesquisa = () => {
        setSearchModal(false);
        refreshCampeonatos();
    }

    const abrirModal = () => setAddModal(true);

    const abrirTelaCampeonato = (campeonatoId: number) => 
        router.navigate({pathname: '/(auth)/(tabs)/campeonato/[campeonatoId]/', params: {campeonatoId}});
    
    return (<>
        <AddCampeonatoModal
            isVisible={addModal}
            onClose={onCloseModal}
        />

        <PesquisarCampeonatoModal 
            visible={searchModal}
            onClose={onClosePesquisa}
        />

        <FlatList 
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshCampeonatos}/>}
            data={campeonatos}
            contentContainerStyle={styles.containerCampeonatos}
            ListHeaderComponent={<>
                <View style={styles.header}>
                    <StyledText style={styles.headerTitulo}>Campeonatos</StyledText>
                    <View style={styles.containerBotoesHeader}>
                        <TouchableOpacity style={styles.botaoPesquisa} onPress={() => setSearchModal(true)}>
                            <FontAwesome5 name="search" style={styles.iconePesquisa} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botaoAddCampeonato} onPress={() => setAddModal(true)}>
                            <Ionicons name="add-circle" style={styles.iconeAdd} />
                            <StyledText style={styles.txtBotaoAdd}>Novo</StyledText>
                        </TouchableOpacity>
                    </View>
                </View>

            </>}
            renderItem={({item:campeonato}) =>
                <TouchableOpacity style={styles.card} onPress={() => abrirTelaCampeonato(campeonato.id)}>
                    <StyledText style={styles.nomeCampeonato}>{campeonato.nome}</StyledText>
                    <View style={styles.containerCriadoCampeonato}>
                        <StyledText style={styles.itemCompeticao}>Criado por: <StyledText>{campeonato.id_criador == userId ? "você" : campeonato.username_criador}</StyledText></StyledText>
                        <StyledText style={styles.itemCompeticao}>Criado em: <StyledText>{showDiaMes(campeonato.data_criacao)}</StyledText></StyledText>
                    </View>
                    <StyledText style={styles.itemCompeticao}>Participantes: <StyledText>você{!!campeonato.participantes ? `, ${campeonato.participantes}` : ""}</StyledText></StyledText>
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
                <TouchableOpacity onPress={abrirModal} style={styles.containerSemCampeonatos}>
                    <StyledText style={styles.textoSemCampeonatos}>Nenhum campeonato encontrado, clique para adicionar um novo!</StyledText>
                    <TouchableOpacity style={styles.containerBtnVazio} onPress={() => setAddModal(true)}>
                            <Ionicons name="add-circle" style={styles.iconeBtnVazio} />
                    </TouchableOpacity>
                </TouchableOpacity>
            }
        />
    </>);
}

const styles = StyleSheet.create({
    containerCampeonatos:{
        flex:1,
        padding:18,
        backgroundColor: colors.preto.padrao
    },
    containerBotoesHeader:{
        gap: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    botaoPesquisa:{
        marginLeft: 8
    },
    iconePesquisa:{
        fontSize: 20,
        color: colors.branco.padrao,
    },
    header:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 5
    },
    headerTitulo:{
        fontSize: 24,
        fontFamily: fonts.padrao.Bold700,
        color: colors.branco.padrao,
    },
    botaoAddCampeonato: {
        backgroundColor: colors.verde.padrao2,
        borderRadius: 10,
        gap: 5,
        flexDirection: "row",
        paddingHorizontal: 5,
        alignItems: "center"
    },
    textoAdd:{
        fontSize: 15,
        fontFamily: fonts.padrao.Regular400
    },
    iconeAdd:{
        fontSize: 24,
        color: colors.preto.padrao,
    },
    txtBotaoAdd:{
        fontFamily: fonts.padrao.Bold700
    },
    card:{
        backgroundColor: colors.cinza.medio4,
        borderWidth: 2,
        borderRadius: 15,
        padding: 10,
        marginVertical: 2
    },
    nomeCampeonato:{
        fontSize: 17,
        fontFamily: fonts.padrao.Bold700,
        color: colors.branco.padrao
    },
    containerCriadoCampeonato:{
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    txtProgresso: {
        fontFamily: fonts.padrao.Light300,
        color: colors.branco.padrao
    },
    progressBar:{
        marginTop: 8, 
        flex: 1, 
        height: 8
    },
    itemCompeticao:{
        fontFamily: fonts.padrao.Medium500,
        color: colors.branco.padrao
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
    containerBtnVazio:{
        fontSize: 30,
        color: colors.branco.padrao,
        backgroundColor: colors.verde.padrao2,
        padding: 5,
        borderRadius: 25,
        marginTop: 5
    },
    iconeBtnVazio:{
        fontSize: 30,
        color: colors.preto.padrao,
    }
})
  