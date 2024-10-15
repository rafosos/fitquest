import { useSession } from '@/app/ctx';
import User from '@/classes/user';
import { colors } from '@/constants/Colors';
import UserService from '@/services/user_service';
import React, { useRef } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabAvatar() {
  const service = UserService();
  const { signOut, user: userString } = useSession();
  const user:User = useRef(JSON.parse(userString ?? "{}")).current;

  const onPressLogOut = () => {
    signOut();
  }
  
    return (
      <ScrollView contentContainerStyle={s.container}>
        <View style={s.containerNomes}>
          <Text style={s.nickname}>{user.nickname}</Text>
          {/* <Text style={styles.fullname}>{user.fullname}</Text> */}
        </View>

        <View style={s.containerImagem}>
          <Image style={s.gifAvatar} source={require('@/assets/images/avatar.gif')} />
        </View>

        <Text style={s.tituloCard}>Dados pessoais</Text>
        <View>
          <Text style={{...s.cardInfo, ...s.textTop}}>Nome completo: <Text style={s.valorCard}>{user.fullname}</Text></Text>
          <Text style={{...s.cardInfo, ...s.textMiddle}}>Data de nascimento: <Text style={s.valorCard}>{user.nascimento}</Text></Text>
          <Text style={{...s.cardInfo, ...s.textBottom}}>Email: <Text style={s.valorCard}>{user.email}</Text></Text>
        </View>

        <TouchableOpacity style={{...s.cardInfo, ...s.containerBotao}} onPress={onPressLogOut}>
          <Text style={s.textoBotao}>SAIR</Text>
        </TouchableOpacity>
      </ScrollView>
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
    // flex:1
  },
  nickname:{
    color: colors.preto.padrao,
    fontSize: 20,
    fontWeight: "800"
  },
  fullname:{

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
  card:{
    borderColor: colors.cinza.escuro,
    borderWidth: 2,
    borderRadius: 10,
    flex:1,
    padding: 10
  },
  tituloCard:{
    fontSize: 19,
    fontWeight: "600",
    paddingLeft: 5
  },
  cardInfo:{
    borderWidth: 2, 
    borderColor: colors.cinza.escuro,
    padding:10,
    fontWeight: "600",
    fontSize: 16
  },
  textTop:{
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textMiddle:{
    borderTopWidth: 0, 
    borderBottomWidth: 0
  },
  textBottom:{
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  valorCard:{
    fontWeight: "400"
  },
  containerBotao:{
    backgroundColor: colors.cinza.escuro,
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "flex-end"
  },
  textoBotao:{
    textAlign: 'center',
    color: colors.branco.padrao
  }
})