import { Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useSession } from '@/app/ctx';
import Campeonato from '@/classes/campeonato';
import AddCampeonatoModal from '@/components/AddCampeonatoModal';
import CampeonatoService from '@/services/campeonato_service';
import ActionButton from '@/components/ActionButton';
import { colors } from '@/constants/Colors';
import DetalhesCampeonatoModal from '@/components/DetlhesCampeonatoModal';

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
                <Text style={styles.titulo}>Campeonatos</Text>
            }
            renderItem={({item:campeonato}) =>
                <TouchableOpacity style={styles.card} onPress={() => setDetahesModal({show: true, campeonato_id: campeonato.id})}>
                    <Text style={styles.nomeCampeonato}>{campeonato.nome}</Text>
                    <Text>Participantes: {campeonato.participantes}</Text>
                    <Text>Criador: {campeonato.nickname_criador}</Text>
                </TouchableOpacity>
            }
            ListEmptyComponent={
                <TouchableOpacity onPress={abrirModal} style={styles.containerSemCampeonatos}>
                    <Text style={styles.textoSemCampeonatos}>Nenhum campeonato encontrado, clique para adicionar um novo!</Text>
                    <AntDesign name="plus" size={30} color={colors.branco.padrao} />
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
        fontWeight: "800"
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
    }
})
  