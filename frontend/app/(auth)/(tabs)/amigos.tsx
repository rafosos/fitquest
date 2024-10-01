import { useSession } from '@/app/ctx';
import User from '@/classes/user';
import AddUserModal from '@/components/AddUserModal';
import UserService from '@/services/user_service';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text } from 'react-native';

export default function TabAmigos() {
    const [addModal, setAddModal] = useState(false);
    const [amigos, setAmigos] = useState<User[]>([]);
    const {userId} = useSession();

    const userService = UserService();

    useEffect(() => 
    refreshFriendList(), []);

    const refreshFriendList = () => {
        if(userId)
            userService.getAmigos(userId)
                .then(res => setAmigos(res))
                .catch(err => console.log(err));
    }
    
    const onCloseModal = () => {
        refreshFriendList();
        // show smth for user, some feedback
    }

    return (<>
        <Text>i'll be there for you sz</Text>

        <AddUserModal
            isVisible={addModal}
            onClose={onCloseModal}
        />

        <Button 
            title='add amigo'
            onPress={() => setAddModal(true)}
        />
        </>
    );
  }
  