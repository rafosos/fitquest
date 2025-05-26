import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '@/constants/Colors';
import { RotinaResumida } from '@/classes/rotina';
import AddRotinaModal from '@/components/AddRotinaModal';
import RotinaService from '@/services/rotina_service';
import { errorHandlerDebug } from '@/services/service_config';
import StyledText from '@/components/base/styledText';
import { fonts } from '@/constants/Fonts';
import { router } from 'expo-router';

export default function TabTreino() {
    const [refreshing, setRefreshing] = useState(false);
    const [rotinas, setRotinas] = useState<RotinaResumida[]>([]);
    const [addRotina, setAddRotina] = useState(false);
    const rotinaService = RotinaService();

    useEffect(() => {
        refresh();
    }, []);

    const getRotinas = () => {
        setRefreshing(true);
        rotinaService.getRotinas()
            .then(res => setRotinas(res))
            .catch(err => errorHandlerDebug(err))
            .finally(() => setRefreshing(false))
    }

    const abrirRotina = (rotinaId: number) => 
        router.navigate({pathname: '/(auth)/(tabs)/rotina/[rotinaId]/', params: {rotinaId}});

    const refresh = async () => {
        setAddRotina(false);
        setRefreshing(true);
        getRotinas();
    }

    return (
        <View style={styles.container}>
            <AddRotinaModal 
                isVisible={addRotina}
                onClose={refresh}
            />
            <FlatList 
                contentContainerStyle={{flex:1}}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh}/>}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <StyledText style={styles.headerTitulo}>Treinos</StyledText>

                        <TouchableOpacity style={styles.botaoAddRotina} onPress={() => setAddRotina(true)}>
                            <Ionicons name="add-circle" style={styles.iconeAdd} />
                            <StyledText style={styles.txtBotaoAdd}>Novo</StyledText>
                        </TouchableOpacity>
                    </View>
                }
                data={rotinas}
                renderItem={({item}) => <>
                    <TouchableOpacity style={styles.cardTreino} onPress={() => abrirRotina(item.id)}>
                        <StyledText style={styles.nomeRotina}>{item.nome}</StyledText>
                        <StyledText style={styles.diasRotina}>Dias na semana: {item.dias}</StyledText>
                        <StyledText style={styles.exercicios}>{item.exercicios}</StyledText>
                    </TouchableOpacity>
                </>}
                ListEmptyComponent={<View style={styles.listEmptyContainer}>
                    <StyledText style={styles.txtListEmpty}>Nenhuma rotina de treino encontrada.</StyledText>
                </View>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        padding: 18,
        flex: 1,
        backgroundColor: colors.preto.padrao
    },
    header:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        marginTop: 5
    },
    headerTitulo:{
        fontSize: 24,
        fontFamily: fonts.padrao.Bold700,
        color: colors.branco.padrao,
    },
    botaoAddRotina: {
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
    cardTreino:{
        backgroundColor: colors.cinza.medio4,
        borderWidth:2,
        borderRadius: 15,
        padding: 10,
        marginVertical: 5
    },
    nomeRotina:{
        fontSize: 20,
        fontFamily: fonts.padrao.Medium500,
        color: colors.branco.padrao
    },
    diasRotina:{
        color: colors.branco.padrao    
    },
    exercicios:{
        color: colors.branco.padrao    
    },
    listEmptyContainer:{
        flex:1,
        alignItems: "center",
        justifyContent: "center"
    },
    txtListEmpty:{
        color: colors.branco.padrao
    }
});
  