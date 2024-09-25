import { useSession } from '@/app/ctx';
import UserService from '@/services/user_service';
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function TabAvatar() {
  const service = UserService();
  const { signOut } = useSession();


  const onPressTeste = () => {
    // service.cadastro()
    fetch("http://192.168.0.50:8000/cadastro")
      .then(res => console.log("deu bom" + res))
      .catch(err => console.log("nao deu bom" + err))
  }

  const onPressLogOut = () => {
    signOut();
  }
  
    return (
      <View>
        <Text>eu so o avatar o ultimo emstre do ar</Text>

        <Button
          onPress={onPressTeste}
          title="teste"
          color="#841584"
          />
        <Button
          onPress={onPressLogOut}
          title="log out"
          color="#841584"
          />
      </View>
    );
  }
  