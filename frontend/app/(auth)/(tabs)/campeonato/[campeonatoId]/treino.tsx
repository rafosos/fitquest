import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import CampeonatoService from "@/services/campeonato_service";
import { ErrorHandler } from "@/utils/ErrorHandler";
import StyledText from "@/components/base/styledText";
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import ListaExercicios from "@/components/campeonato/ListaExercicios";
import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import { HeaderPaginaDetalhes } from "@/components/base/headerModalPaginaDetalhes";
import { ExercicioCampeonatoTreino } from "@/classes/campeonato";
import { SceneMap, TabView } from "react-native-tab-view";
import { useToast } from "react-native-toast-notifications";

export default function AddTreinoCampeonato(){
    const [checkboxes, setCheckboxes] = useState<boolean[]>([]);
    const [imagem, setImagem] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [exercicios, setExercicios] = useState<ExercicioCampeonatoTreino[]>([]);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {key: "exercicios", title: "Exercícios"}, 
        {key: 'imagem', title: "Imagem"},
        {key: 'finalizar', title: "Finalizar"}
    ]);
    const layout = useWindowDimensions();
    const campeonatoId = Number(useLocalSearchParams().campeonatoId);
    const campeonatoNome = useLocalSearchParams().campeonatoNome as string;
    const toast = useToast();
    const campeonatoService = CampeonatoService();
    const errorHandler = ErrorHandler();

    useEffect(() => {
        setLoading(true);
        campeonatoService.getExercicios(campeonatoId)
            .then(res => setExercicios(res))
            .catch(err => errorHandler.handleError(err))
            .finally(() => setLoading(false));
    }, []);

    const cancelarTreino = () => {
        setCheckboxes([]);
        router.back();
    }
    
    const finalizarTreino = () => {

        if (imagem == null){
            toast.show("A imagem é obrigatória para salvar o treino!", {type: "danger"});
        }

        campeonatoService.addTreino(
            exercicios.filter((e, i) => checkboxes[i]).map(e => e.id).filter(e => e != undefined) ?? [],
            imagem
        )
            .then(res => clearAndClose())
            .catch(err => errorHandler.handleError(err));
    }

    const clearAndClose = () => {
        router.back();
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1,1],
            quality: 0.5,
        });
    
        console.log(result);
    
        if (!result.canceled) {
            setImagem(result.assets[0]);
        }
    };

    const openCamera = async () =>{
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1,1],
            quality: 0.5,
        });
    
        console.log(result);
    
        if (!result.canceled) {
            setImagem(result.assets[0].uri);
        }
    }

    const salvarExercicios = () => {
        if(checkboxes.some(c => c))
            setIndex(1);
        else{
            toast.show("Você precisa escolher ao menos um exercício!", {type: "danger"});
        }
    }

    return (
    <TabView
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        swipeEnabled={false}
        initialLayout={{width: layout.width}}
        renderTabBar={() => <></>}
        renderScene={SceneMap({
            exercicios: () => <>
                <View style={styles.header}>
                    <HeaderPaginaDetalhes 
                        titulo={campeonatoNome}
                        onClose={router.back}
                        showSair={false}
                        showDelete={false}
                    />
                </View>

                <TouchableOpacity style={styles.botaoTreino} onPress={salvarExercicios}>
                    <Entypo name="controller-stop" style={styles.iconeBotaoTreino} />
                    <StyledText style={styles.txtBotaoNovoTreino}>FINALIZAR TREINO</StyledText>
                </TouchableOpacity>

                <ListaExercicios
                    exercicios={exercicios ?? []}
                    novoTreino={true}
                    checkboxes={checkboxes}
                    setCheckboxes={setCheckboxes}
                    refreshing={loading}
                />

                <View style={styles.footerTreino}>
                    <TouchableOpacity style={[styles.botaoFooter, styles.botaoFooterCancelar]} onPress={cancelarTreino}>
                        <AntDesign name="close" style={styles.iconeBotaoTreino} />
                        <StyledText style={styles.txtBotaoNovoTreino}>CANCELAR</StyledText>
                    </TouchableOpacity>
                
                    <TouchableOpacity style={styles.botaoFooter} onPress={salvarExercicios}>
                        <Entypo name="controller-stop" style={styles.iconeBotaoTreino} />
                        <StyledText style={styles.txtBotaoNovoTreino}>FINALIZAR TREINO</StyledText>
                    </TouchableOpacity>
                </View>

            </>,
            imagem: () => <>
                <View style={styles.header}>
                    <HeaderPaginaDetalhes 
                        titulo={campeonatoNome}
                        onClose={() => setIndex(0)}
                        showSair={false}
                        showDelete={false}
                    />
                </View>


                <View style={styles.containerImages}>
                    <StyledText style={styles.titleImagem}>Adicionar imagem</StyledText>

                    <View style={styles.containerOpcoes}>
                        <TouchableOpacity onPress={pickImage} style={styles.containerIcone}>
                            <Feather name="image" style={styles.iconeImagem}/>
                            <StyledText  style={styles.legendaBtn}>Abrir galeria</StyledText>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={openCamera} style={styles.containerIcone}>
                            <Feather name="camera" style={styles.iconeImagem} />
                            <StyledText style={styles.legendaBtn}>Abrir câmera</StyledText>
                        </TouchableOpacity>
                    </View>
                </View>

                <StyledText style={styles.titleExercicios}>Exercicios selecionados:</StyledText>
                
                <ListaExercicios
                    exercicios={exercicios ?? []}
                    novoTreino={false}
                    selecionados={true}
                    checkboxes={checkboxes}
                    refreshing={loading}
                />

                
            <View style={styles.footerTreino}>
                    <TouchableOpacity style={[styles.botaoFooter, styles.botaoFooterCancelar]} onPress={cancelarTreino}>
                        <AntDesign name="close" style={styles.iconeBotaoTreino} />
                        <StyledText style={styles.txtBotaoNovoTreino}>CANCELAR</StyledText>
                    </TouchableOpacity>
                
                    <TouchableOpacity style={styles.botaoFooter} onPress={finalizarTreino}>
                        <Entypo name="controller-stop" style={styles.iconeBotaoTreino} />
                        <StyledText style={styles.txtBotaoNovoTreino}>FINALIZAR TREINO</StyledText>
                    </TouchableOpacity>
                </View>
            </>,
            finalizar: () => <></>
        })}/>
    )
};

const styles = StyleSheet.create({
    header:{
        paddingHorizontal: 10
    },
    botaoTreino:{
        marginVertical: 15,
        padding: 5,
        borderRadius: 15,
        flexDirection: "row",        
        backgroundColor: colors.verde.padrao,
        alignItems: "center",
        justifyContent: "center"
    },
    txtBotaoNovoTreino:{
        color: colors.branco.padrao,
        fontSize: 15,
        textAlignVertical: "center",
    },
    iconeBotaoTreino:{
        color: colors.branco.padrao,
        fontSize: 20,
        marginRight: 10
    },
    tabs:{
        backgroundColor: colors.cinza.background,
    },
    footerTreino:{
        flexDirection: "row",
        justifyContent: "space-between"    
    },
    botaoFooter:{
        flex:1,
        marginVertical: 15,
        marginHorizontal: 5,
        padding: 5,
        paddingHorizontal: 20,
        borderRadius: 15,
        flexDirection: "row",        
        backgroundColor: colors.verde.padrao,
        alignItems: "center",
        justifyContent: "center"
    },
    botaoFooterCancelar:{
        backgroundColor: colors.cinza.medio2
    },
    containerImages:{
        borderColor: colors.branco.padrao,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        padding: 10,
        marginHorizontal: 50
    },
    titleImagem:{
        color: colors.branco.padrao,
        textAlign: 'center',
        fontSize: 15,
        fontFamily: fonts.padrao.Bold700,
        marginBottom: 15
    },
    containerOpcoes:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerIcone:{
        borderColor: colors.branco.padrao,
        borderWidth: 4,
        borderRadius: 15,
        marginHorizontal: 15,
        padding: 10
    },
    iconeImagem:{
        marginHorizontal: 20,
        marginTop: 15,
        fontSize: 50,
        color: colors.branco.padrao
    },
    titleExercicios:{
        fontSize: 20,
        marginTop:15,
        marginHorizontal: 20,
        fontFamily: fonts.padrao.Bold700,
        color: colors.branco.padrao
    },
    legendaBtn:{
        fontSize: 15,
        fontFamily: fonts.padrao.Bold700,
        color: colors.branco.padrao
    }
});