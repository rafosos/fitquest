import { useSession } from '@/app/ctx';
import { Streaks } from '@/classes/streaks';
import User from '@/classes/user';
import { TipoTreino, TreinoResumo } from '@/classes/user_exercicio';
import { colors } from '@/constants/Colors';
import ExercicioService from '@/services/exercicio_service';
import { errorHandlerDebug } from '@/services/service_config';
import UserService from '@/services/user_service';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native';

export default function TabAvatar() {
    const { user: userString } = useSession();
    const [atividades, setAtividades] = useState<TreinoResumo[]>([]);
    const [streaks, setStreaks] = useState<Streaks>();
    const [refreshing, setRefreshing] = useState(false);
    const user:User = useRef(JSON.parse(userString ?? "{}")).current;
    const exercicioService = ExercicioService();

    useEffect(() => {
      refresh();
    }, []);
    
    const refresh = () => {
      getAtividades();
      getStreaks();  
    }

    const getStreaks = () => {
        exercicioService.getStreaks(user.id)
            .then(res => setStreaks(res))
            .catch(err => errorHandlerDebug(err));
    }
    
    const getAtividades = () => {
        setRefreshing(true)
        exercicioService.getUltimosTreinosResumo(user.id)
        .then(res => setAtividades(res))
        .catch(err => errorHandlerDebug(err))
        .finally(() => setRefreshing(false))
    }

    return (
        <FlatList
            contentContainerStyle={s.container}
            data={atividades}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh}/>}
            ListHeaderComponent={<>
                <View style={s.containerNomes}>
                  <Text style={s.nickname}>{user.nickname}</Text>
                  <Link href="/configuracoes" style={s.iconeConfigs}>
                      <Feather name="settings" size={24} color="black" />
                  </Link>
                </View>

                <View style={s.containerImagem}>
                <Image style={s.gifAvatar} source={require('@/assets/images/avatar.gif')} />
                </View>

                <View style={s.streaksContainer}>
                    <View style={s.card}>
                        <Text>Streak semanal</Text>
                        <Text style={s.txtStreak}>{streaks?.streak_semanal?.streak_length}</Text>
                    </View>

                    <View style={s.card}>
                        <Text>Streak diário</Text>
                        <Text style={s.txtStreak}>{streaks?.streak_diario?.streak_length}</Text>
                    </View>
                </View>

                <Text style={s.tituloUltimasAtividades}>Últimas atividades</Text>
            </>}
            renderItem={({item}) => 
                <View style={s.card}>
                    <View style={s.headerCard}>
                        <View>
                            <Text>{item.nome ?? "Treino"}</Text>
                            <View style={s.chip}>
                                <Text style={s.txtChip}>{item.tipo && TipoTreino[item.tipo]}</Text>
                            </View>
                        </View>

                        <Text>{`${item.data}`}</Text>
                    </View>

                <Text>{item.exercicios}</Text>
                </View>
            }
            ListEmptyComponent={<Text>Nenhuma atividade recente.</Text>}
        />
    );
}

const s = StyleSheet.create({
  container:{
    flex:1,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    padding: 10
  },
  containerNomes:{
    flexDirection: "row",
    justifyContent: "space-between"
  },
  nickname:{
    color: colors.preto.padrao,
    fontSize: 20,
    fontWeight: "800"
  },
  iconeConfigs:{

  },
  containerImagem:{
    overflow: "hidden",
    justifyContent: "center",
    height: 250
  },
  gifAvatar:{
    resizeMode: "contain",
    height: '100%',
    alignSelf: "center"
  },
  streaksContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  txtStreak:{
    textAlign: 'center'
  },
  tituloUltimasAtividades:{
    fontSize: 20,
    fontWeight: "700",
  },
  card:{
    marginVertical: 5,
    borderColor: colors.cinza.escuro,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10
  },
  headerCard:{
    flexDirection:"row",
    justifyContent: "space-between"
  },
  chip:{

  },
  txtChip:{

  }
})