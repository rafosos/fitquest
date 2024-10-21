import { useSession } from '@/app/ctx';
import User from '@/classes/user';
import { TreinoResumo } from '@/classes/user_exercicio';
import { colors } from '@/constants/Colors';
import ExercicioService from '@/services/exercicio_service';
import { errorHandlerDebug } from '@/services/service_config';
import UserService from '@/services/user_service';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function TabAvatar() {
    const [atividades, setAtividades] = useState<TreinoResumo[]>([]);
    const exercicioService = ExercicioService();
    const [refreshing, setRefreshing] = useState(false);
    const { user: userString } = useSession();
    const user:User = useRef(JSON.parse(userString ?? "{}")).current;

    useEffect(() => {
        getAtividades()
    }, []);

    const getAtividades = () => {
        setRefreshing(true)
        exercicioService.getUltimosTreinosResumo(user.id)
          .then(res => {
            console.log(res),
            setAtividades(res)})
          .catch(err => errorHandlerDebug(err))
          .finally(() => setRefreshing(false))
    }

    return (
        <FlatList
            contentContainerStyle={s.container}
            data={atividades}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getAtividades}/>}
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

                <Text style={s.tituloUltimasAtividades}>Últimas atividades</Text>
            </>}
            renderItem={({item}) => 
                <View style={s.card}>
                    <View style={s.headerCard}>
                        <View>
                            <Text>{item.campeonato_nome ?? item.rotina_nome}</Text>
                            <View style={s.chip}>
                                <Text style={s.txtChip}>{item.rotina_id ? "Rotina" : "Campeonato"}</Text>
                            </View>
                        </View>

                        {/* <Text>{`${item.data.getDate()} ${meses[item.data.getMonth()]}`}</Text> */}
                        <Text>{`${item.data}`}</Text>
                    </View>

                <Text>{item.exercicios}</Text>
                </View>
            }
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