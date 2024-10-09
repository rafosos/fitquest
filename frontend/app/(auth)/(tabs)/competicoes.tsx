import { Text, FlatList, RefreshControl, View, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useSession } from '@/app/ctx';
import Campeonato from '@/classes/campeonato';
import AddCampeonatoModal from '@/components/AddCampeonatoModal';
import CampeonatoService from '@/services/campeonato_service';
import ActionButton from '@/components/ActionButton';

export default function TabEventos() {
    const [addModal, setAddModal] = useState(false);
    const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const {userId} = useSession();

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
        refreshCampeonatos();
        // show smth for user, some feedback
    }

    const abrirModal = () => setAddModal(true);


    return (<>
        <AddCampeonatoModal
            isVisible={addModal}
            onClose={onCloseModal}
        />

        <FlatList 
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshCampeonatos}/>}
            data={campeonatos}
            contentContainerStyle={{flex: 1}}
            ListHeaderComponent={
                <Text style={styles.titulo}>Campeonatos</Text>
            }
            renderItem={({item:campeonato}) => 
                <Text>{campeonato.nome}</Text>
            }
            ListEmptyComponent={<View style={styles.containerSemCampeonatos}>
                <Text>no campeonatos?</Text>
                <AntDesign onPress={abrirModal} name="adduser" size={24} color="black" />
            </View>}
        />

        <ActionButton acao={abrirModal}/>
    </>);
}

const styles = StyleSheet.create({
    containerSemCampeonatos:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    textoSemAmigos:{
        fontSize: 18
    },
    titulo:{
        fontSize: 18
    }
})
  