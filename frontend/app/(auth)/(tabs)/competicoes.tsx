import { Button, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useSession } from '@/app/ctx';
import Campeonato from '@/classes/campeonato';
import AddCampeonatoModal from '@/components/AddCampeonatoModal';
import CampeonatoService from '@/services/campeonato_service';

export default function TabEventos() {
  const [addModal, setAddModal] = useState(false);
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const {userId} = useSession();

  const campeonatoService = CampeonatoService();

  useEffect(() => 
  refreshCampeonatos(), []);

  const refreshCampeonatos = () => {
      if(!userId) return;
      
      campeonatoService.getCampeonatos(userId)
          .then(res => setCampeonatos(res))
          .catch(err => console.log(err));
  }
  
  const onCloseModal = () => {
      setAddModal(false);
      refreshCampeonatos();
      // show smth for user, some feedback
  }

  const abrirModal = () => setAddModal(true);

  return (<>
      <AddCampeonatoModal
          isVisible={addModal}
          onClose={onCloseModal}
      />

      <FlatList
          data={campeonatos}
          renderItem={({item:campeonato}) => <> 
              <Text>{campeonato.nome}</Text>
          </>}
          ListEmptyComponent={<>
            <Text>no campeonatos?</Text>
            <AntDesign onPress={abrirModal} name="adduser" size={24} color="black" />
          </>}
      />

      <Button
          title='criar campeonato'
          onPress={abrirModal}
      />
      </>
  );
  }
  