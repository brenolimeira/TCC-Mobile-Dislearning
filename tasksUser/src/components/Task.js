import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'

import commonStyles from '../commonStyles'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {

    const doneOrNotStyle = props.doneAt != null ? { textDecorationLine: 'line-through', color: '#AAA' } : {  }
    const enableOrDisable = props.doneAt != null ? true : false

    const date = props.doneAt ? props.doneAt : props.estimateAt
    const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM')

    return (
        <View>
            <TouchableOpacity onPress={() => props.onShow(props.id)} disabled={enableOrDisable}>
                <View style={styles.container}>
                    <View>
                        {getCheckView(props.doneAt)}
                    </View>
                    <Text style={[styles.text, doneOrNotStyle]}>{props.desc}</Text>
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
    text: {
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