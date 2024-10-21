import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '@/constants/Colors';
import { RotinaResumida } from '@/classes/rotina';
import AddRotinaModal from '@/components/AddRotinaModal';
import RotinaService from '@/services/rotina_service';
import { useSession } from '@/app/ctx';
import { errorHandlerDebug } from '@/services/service_config';
import DetalhesRotinaModal from '@/components/DetalhesRotinaModal';

export default function TabTreino() {
    const [refreshing, setRefreshing] = useState(false);
    const [rotinas, setRotinas] = useState<RotinaResumida[]>([]);
    const [addRotina, setAddRotina] = useState(false);
    const [detalhesModal, setDetahesModal] = useState({show: false, rotina_id:0});
    const { id: userId } = JSON.parse(useSession().user ?? "{id: null}");
    const rotinaService = RotinaService();

    useEffect(() => {
        refresh()
    }, []);


    const getRotinas = () => {
        if(!userId) return;
        setRefreshing(true);
        rotinaService.getRotinas(userId)
            .then(res => setRotinas(res))
            .catch(err => errorHandlerDebug(err))
            .finally(() => setRefreshing(false))
    }

    const refresh = async () => {
        setAddRotina(false);
        setDetahesModal({...detalhesModal, show:false});
        setRefreshing(true);
        await getRotinas();
        setRefreshing(false);
    }

    return (
        <View style={{marginHorizontal: 15, marginVertical: 7, flex:1}}>
            <AddRotinaModal 
                isVisible={addRotina}
                onClose={refresh}
            />
            <DetalhesRotinaModal
                rotinaId={detalhesModal.rotina_id}
                isVisible={detalhesModal.show}
                onClose={refresh}
            />
            <FlatList 
                contentContainerStyle={{flex:1}}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh}/>}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerTitulo}>Treinos</Text>

                        <TouchableOpacity style={styles.botaoAddRotina} onPress={() => setAddRotina(true)}>
                            <Text style={styles.textoAdd}>Adicionar rotina de treino</Text>
                            <Ionicons name="add-circle" style={styles.iconeAdd} />
                        </TouchableOpacity>
                    </View>
                }
                data={rotinas}
                renderItem={({item}) => <>
                    <TouchableOpacity style={styles.cardTreino} onPress={() => setDetahesModal({show: true, rotina_id: item.id})}>
                        <Text style={styles.nomeRotina}>{item.nome}</Text>
                        <Text style={styles.diasRotina}>Dias na semana: {item.dias}</Text>
                        <Text style={styles.exercicios}>{item.exercicios}</Text>
                    </TouchableOpacity>
                </>}
                ListEmptyComponent={<View style={styles.listEmptyContainer}>
                    <Text>Nenhuma rotina de treino encontrada.</Text>
                </View>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        marginTop: 5
    },
    headerTitulo:{
        fontSize: 25,
        fontWeight: "800"
    },
    botaoAddRotina: {
        backgroundColor: colors.cinza.medio,
        borderRadius: 25,
        flexDirection: "row",
        paddingLeft: 13,
        paddingRight: 10,
        alignItems: "center"
    },
    textoAdd:{
        fontSize: 15,
        fontWeight: "500"
    },
    iconeAdd:{
        fontSize: 24,
        color: colors.preto.padrao,
        marginLeft: 5
    },
    cardTreino:{
        backgroundColor: colors.cinza.medio,
        borderWidth:2,
        borderColor: colors.cinza.escuro,
        borderRadius: 15,
        padding: 10,
        marginVertical: 5
    },
    nomeRotina:{
        fontSize: 20,
        fontWeight: "800"
    },
    diasRotina:{
        
    },
    exercicios:{
        
    },
    listEmptyContainer:{
        flex:1,
        alignItems: "center",
        justifyContent: "center"
    },
});
  