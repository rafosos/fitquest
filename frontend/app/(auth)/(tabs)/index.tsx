import { useSession } from '@/app/ctx';
import { InformacoesUsuario } from '@/classes/streaks';
import User from '@/classes/user';
import { TipoTreino, TreinoResumo } from '@/classes/user_exercicio';
import StyledText from '@/components/base/styledText';
import { colors } from '@/constants/Colors';
import { fonts } from '@/constants/Fonts';
import ExercicioService from '@/services/exercicio_service';
import { errorHandlerDebug } from '@/services/service_config';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, RefreshControl, StyleSheet, View } from 'react-native';

class DataFlatlist{
  constructor(title:string, value: any, editable = true) {
    this.title = title;
    this.value = value;
    this.editable = editable;
  }

  title: string;
  value: any;
  editable:boolean;
}

export default function TabAvatar() {
    const { user: userString } = useSession();
    const [atividades, setAtividades] = useState<TreinoResumo[]>([]);
    const [informacoesUsuario, setInformacoesUsuario] = useState<InformacoesUsuario>();
    const [refreshing, setRefreshing] = useState(false);
    const user: User = useRef(JSON.parse(userString ?? "{}")).current;
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
            .then(res => setInformacoesUsuario(res))
            .catch(err => errorHandlerDebug(err));
    }
    
    const getAtividades = () => {
        setRefreshing(true)
        exercicioService.getUltimosTreinosResumo(user.id)
        .then(res => setAtividades(res))
        .catch(err => errorHandlerDebug(err))
        .finally(() => setRefreshing(false))
    }

    const getData = () => {
      return [
        new DataFlatlist('Streak semanal', informacoesUsuario?.streak_semanal?.streak_length, false),
        new DataFlatlist('Streak diário', informacoesUsuario?.streak_diario?.streak_length, false),
        new DataFlatlist('Peso', informacoesUsuario?.peso ?? "..."),
        new DataFlatlist('Altura', informacoesUsuario?.altura ?? "..."),
      ];
    }

    return (
      <View style={s.container}>
        <FlatList
            contentContainerStyle={s.containerFlatlist}
            data={atividades}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh}/>}
            ListHeaderComponent={<>
                <View style={s.containerNomes}>
                    <StyledText style={s.nickname}>{user.nickname}</StyledText>
                    <Link href="/configuracoes">
                        <Feather name="settings" style={s.iconeConfigs} />
                    </Link>
                </View>

                <View style={s.containerImagem}>
                    <Image style={s.gifAvatar} source={require('@/assets/images/avatar-home.png')} />
                </View>

                <FlatList
                    data={getData()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) =>
                        <View style={[s.card, s.cardInformacoesPessoais]}>
                            <StyledText>{item.title}: <StyledText style={s.txtStreak}>{item.value}</StyledText></StyledText> 
                            {item.editable && <MaterialIcons name="edit" style={s.iconeEditar} />}
                        </View>
                    }
                />

                <StyledText style={s.tituloUltimasAtividades}>Últimas atividades</StyledText>
            </>}
            renderItem={({item}) => 
                <View style={s.card}>
                    <View style={s.headerCard}>
                        <View>
                            <StyledText>{item.nome ?? "Treino"}</StyledText>
                            <View style={s.chip}>
                                <StyledText style={s.txtChip}>{item.tipo && TipoTreino[item.tipo]}</StyledText>
                            </View>
                        </View>

                        <StyledText>{`${item.data}`}</StyledText>
                    </View>

                <StyledText>{item.exercicios}</StyledText>
                </View>
            }
            ListEmptyComponent={<StyledText style={s.txtNenhumaAtividade}>Nenhuma atividade recente.</StyledText>}
        />
        </View>
    );
}

const s = StyleSheet.create({
  container:{
    flex:1,
    flexDirection: 'column',
    backgroundColor: colors.cinza.background
  },
  containerFlatlist:{
    padding: 10,
  },
  containerNomes:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center'
  },
  nickname:{
    color: colors.branco.padrao,
    fontSize: 30,
    fontFamily: fonts.padrao.Regular400
  },
  iconeConfigs:{
    color: colors.branco.padrao,
    fontSize: 24
  },
  containerImagem:{
    overflow: "hidden",
    justifyContent: "center",
    height: Dimensions.get('window').height * 0.5
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
  iconeEditar:{
    fontSize: 18, 
    color: colors.verde.padrao,
    marginLeft: 5
  },
  tituloUltimasAtividades:{
    fontSize: 20,
    fontFamily: fonts.padrao.Medium500,
    textAlign: 'center',
    color: colors.branco.padrao
  },
  card:{
    marginVertical: 5,
    borderColor: colors.cinza.escuro,
    backgroundColor: colors.branco.padrao,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10
  },
  cardInformacoesPessoais:{
    flexDirection: 'row',
    justifyContent: "space-between",
    borderRadius: 20,
    paddingHorizontal: 15
  },
  headerCard:{
    flexDirection:"row",
    justifyContent: "space-between"
  },
  chip:{

  },
  txtChip:{

  },
  txtNenhumaAtividade:{
    color: colors.branco.padrao,
    textAlign: 'center'
  }
})