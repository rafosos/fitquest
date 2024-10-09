import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '@/constants/Colors';
import Rotina from '@/classes/rotina';
import AddRotinaModal from '@/components/AddRotinaModal';

export default function TabTreino() {
    const [refreshing, setRefreshing] = useState(false);
    const [rotinas, setRotinas] = useState<Rotina[]>([]);
    const [addRotina, setAddRotina] = useState(false);

    const getRotinas = () => {

    }

    const refresh = async () => {
        setAddRotina(false);
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
            <FlatList 
                contentContainerStyle={{flex:1}}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh}/>}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerTitulo}>Treino</Text>

                        <TouchableOpacity style={styles.botaoAddRotina} onPress={() => setAddRotina(true)}>
                            <Text style={styles.textoAdd}>Adicionar rotina de treino</Text>
                            <Ionicons name="add-circle" style={styles.iconeAdd} />
                        </TouchableOpacity>
                    </View>
                }
                data={rotinas}
                renderItem={({item}) => <>
                    <TouchableOpacity style={styles.cardTreino}>
                        <Text>{item.nome}</Text>
                        <Text>{item.dias}</Text>
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
        justifyContent: "space-between"
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
        backgroundColor: colors.cinza.medio
    },
    listEmptyContainer:{
        flex:1,
        alignItems: "center",
        justifyContent: "center"
    }
});
  