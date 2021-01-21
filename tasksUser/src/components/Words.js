import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import commonStyles from '../commonStyles'

export default props => {

    const doneOrNotStyle = props.doneAt != null ? { textDecorationLine: 'line-through', color: '#AAA' } : {  }
    const enableOrDisable = props.doneAt != null ? true : false

    return (
        <View>
            <TouchableOpacity disabled={enableOrDisable} onPress={() => props.onNavigate(props)}>
                <View style={styles.container}>
                    <View>
                        {getCheckView(props.doneAt)}
                    </View>
                    <Text style={[styles.words, doneOrNotStyle]}>{props.word}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

function getCheckView(doneAt) {
    if(doneAt != null) {
        return (
            <View style={styles.done}>
                <Icon name='check' size={20} color='#FFF'></Icon>
            </View>
        )   
    } else {
        return (
            <View style={styles.pending}></View>
        )   
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 10,
        paddingLeft: 10,
        backgroundColor: '#FFF'
    },
    words: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 20,
        paddingLeft: 10,
        justifyContent: 'flex-start'
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: '#4D7031',
        alignItems: 'center',
        justifyContent: 'center'
    }
})