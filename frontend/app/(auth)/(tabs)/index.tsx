import { useSession } from '@/app/ctx';
import UserService from '@/services/user_service';
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function TabAvatar() {
  const service = UserService();
  const { signOut } = useSession();

  const onPressLogOut = () => {
    signOut();
  }
  
    return (
      <View>
        <Text>eu so o avatar o ultimo emstre do ar</Text>

        <Button
          onPress={onPressLogOut}
          title="log out"
          color="#841584"
          />
      </View>
    );
  }
  