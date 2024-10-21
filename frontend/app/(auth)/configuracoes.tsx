import React, { useRef } from 'react';
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import User from '@/classes/user';
import { useSession } from '@/app/ctx';
import { colors } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';

export default function Configuracoes() {
    const { signOut, user: userString } = useSession();
    const user:User = useRef(JSON.parse(userString ?? "{}")).current;

    const onPressLogOut = () => {
      signOut();
    }
  
    return (<View style={s.container}>
        <View style={s.header}>
          <Link href="../">
            <AntDesign name="arrowleft" size={24} color="black" />
          </Link>
          <Text style={s.txtHeader}>Configurações</Text>
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
    </View>
    );
  }

  const s = StyleSheet.create({
    container:{
      padding:10
    },
    header:{
      flexDirection: 'row',
      alignItems: "center",
      marginBottom: 10
    },
    txtHeader:{
      fontSize: 22,
      fontWeight: "800",
      marginLeft: 5,
      textAlignVertical: 'center'
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