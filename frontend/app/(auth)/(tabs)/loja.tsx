import StyledText from '@/components/base/styledText';
import { colors } from '@/constants/Colors';
import { fonts } from '@/constants/Fonts';
import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const imageHeader = require("@/assets/images/loja-todos.png");

const images = [
    require("@/assets/images/barrinha.jpg"),
    require("@/assets/images/coqueteleira.png"),
    require("@/assets/images/coqueteleira2.png"),
    require("@/assets/images/creatina.png"),
    require("@/assets/images/creatina2.jpg"),
    require("@/assets/images/whey.jpg"),
]

const numCol = 2;

export default function TabLoja() {
  
    return (
        <FlatList
            contentContainerStyle={styles.container}
            data={images}
            numColumns={numCol}
            ListHeaderComponent={<View>
                <StyledText style={styles.title}>Loja</StyledText>
                <Image source={imageHeader} resizeMode='repeat'  style={styles.imageHeader}/>
            </View>}
            renderItem={({item}) =>
                <TouchableOpacity style={{flex:1}}>
                    <Image source={item} resizeMode="cover" style={styles.image}/>
                </TouchableOpacity>
            }            
        />
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.cinza.background,
        // flex: 1,
        // paddingHorizontal: 5,
        // alignItems: 'center',
        paddingLeft: 10
    },
    title:{
        fontFamily: fonts.padrao.Bold700,
        color: colors.branco.padrao,
        // marginLeft: 15,
        fontSize: 25
    },
    imageHeader:{
        borderRadius:15,
        height: 200,
        marginVertical: 10,
        width: Dimensions.get('window').width - 20
    },
    image:{
        borderRadius: 15,
        marginBottom: 10,
        height: (Dimensions.get('window').width / numCol) - 10,
        width: (Dimensions.get('window').width / numCol) - 10
    }
})
  