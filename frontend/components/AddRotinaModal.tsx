import { useSession } from '@/app/ctx';
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Modal, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Exercicio from '@/classes/exercicio';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider, AutocompleteDropdownRef } from 'react-native-autocomplete-dropdown';
import RotinaService from '@/services/rotina_service';
import ExercicioService from '@/services/exercicio_service';
import { Feather } from '@expo/vector-icons';


export default function AddRotinaModal({ isVisible = false, onClose = () => {} }) {
    const [nome, setNome] = useState("");
    const [exercicios, setExercicios] = useState<Exercicio[]>([]);
    const [resultados, setResultados] = useState<Exercicio[]>([]);
    const [loading, setLoading] = useState(false);
    const {userId} = useSession();

    const rotinaService = RotinaService();
    const exercicioService = ExercicioService();

    const dropdownController = useRef<AutocompleteDropdownRef | null>(null);
    
    const clearAndClose = () =>{
        setNome("");
        onClose();
    }
    
    const getExerciciosDropdown = (f: string) => {
        if (!f.length) {
            setExercicios([]);
            return;
        }

        setLoading(true);
        exercicioService.getExercicioFiltro(Number(userId), f)
            .then(res => setResultados(res.map(exec => {return {...exec, id: exec.id, title:exec.nome}})))
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }

    const submit = () => {

    }

    return (
        <Modal
            animationType="slide" 
            transparent={false}
            visible={isVisible}
            onRequestClose={clearAndClose}
        >
            <AutocompleteDropdownContextProvider>
                <FlatList 
                    ListHeaderComponent={<>
                        <View style={styles.titleContainer}>
                            <AntDesign name="arrowleft" size={30} color="black" onPress={onClose}/>
                            <Text style={styles.title}>Adicionar rotina</Text>
                        </View>
                        <AutocompleteDropdown
                            controller={controller => {
                                dropdownController.current = controller
                            }}
                            direction={"up"}
                            dataSet={resultados.map(res => {return {...res, id: res.id.toString(), title: res.nome}})}
                            onChangeText={getExerciciosDropdown}
                            onSelectItem={item => {
                                const e = resultados.find((r) => r.id.toString() == item.id);
                                if(!e) return;

                                setExercicios([...exercicios, e]);
                                dropdownController.current?.clear()
                            }}
                            debounce={600}
                            suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
                            loading={loading}
                            useFilter={false}
                            textInputProps={{
                                placeholder: 'Pesquisar exercício',
                                autoCorrect: false,
                                autoCapitalize: 'none',
                            }}
                            inputContainerStyle={{
                                ...styles.inputAutocomplete,
                                backgroundColor: "#fff"
                            }}
                            suggestionsListContainerStyle={{
                                marginLeft: -20
                            }}
                            renderItem={(item) => <Text style={{padding: 15 }}>{item.title}</Text>}
                            ChevronIconComponent={<Feather name="chevron-down" size={20} color="#000" />}
                            ClearIconComponent={<Feather name="x-circle" size={18} color="#000" />}
                            inputHeight={50}
                            closeOnBlur
                            showChevron={false}
                            clearOnFocus={false}
                            EmptyResultComponent={<></>}
                        />
                    </>}
                    data={exercicios}
                    renderItem={({item, index}) => <View>
                        <Text>{item.nome}</Text>

                        <View>
                            <Text>Séries</Text>
                            <TextInput
                                value={nome}
                                onChangeText={(txt) => setNome(txt)}
                                style={styles.input}
                            />
                        </View>


                    </View>}

                    ListEmptyComponent={
                        // <TouchableOpacity onPress={addExercicio}>
                            // <Text>Adicionar exercício</Text>
                        // </TouchableOpacity>
                            <Text style={{textAlign: "center"}}>Não há exercícios.</Text>
                    }
                />
                <Button 
                    title='Adicionar'
                    onPress={submit}    
                />
            </AutocompleteDropdownContextProvider>
        </Modal>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        paddingVertical:10,    
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        marginLeft: 7,
        fontSize: 25,
        fontWeight: "800"
    },
    inputAutocomplete:{
        borderWidth: 1,
        borderColor: "#000",
        // padding: 10,
        margin: 10,
        borderRadius: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: "#000",
        padding: 10,
        margin: 10,
        borderRadius: 4,
        fontWeight: "500"
    }
  });
  