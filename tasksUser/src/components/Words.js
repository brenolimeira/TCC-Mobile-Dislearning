import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native'
import axios from 'axios'
import Icon from 'react-native-vector-icons/FontAwesome'

import commonStyles from '../commonStyles'
import { server, showError } from '../common'

export default props => {

    const [countDone, setCountDone] = useState([])
    const [count, setCount] = useState(0)

    const doneOrNotStyle = props.doneAt != null ? { textDecorationLine: 'line-through', color: '#AAA' } : {  }
    const enableOrDisable = count === props.days ? true : false
    
    useEffect(() => {
        getDoneTasksWords()
        
    }, [countDone.length])


    const getDoneTasksWords = async () => {
        try{
            await axios(`${server}/task-words-done/${props.taskId}/word/${props.word_id}`).then(resp => {
                setCountDone(resp.data)
                setCount(resp.data.length)
            })
        } catch(e) {
            showError(e)
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity disabled={enableOrDisable} 
                onPress={() => props.onNavigate(props)}>
                <View style={styles.inside}>
                    {/* <View>
                        {getCheckView(props.doneAt)}
                    </View> */}
                    <Text style={[styles.words, doneOrNotStyle]}>{props.word}</Text>
                    <Text style={styles.words}></Text>
                    <Text style={styles.words}>{`concluídos \n ${count} de ${props.days}`}</Text>
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

const { width, height } = Dimensions.get('screen')

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: width,
        justifyContent: 'center'
    },
    inside: {
        borderColor: '#b65a76',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        margin: 8,
        width: 200,
        /* backgroundColor: 'rgba(0, 0, 0, 0.2)', */
        borderRadius: 5
    },
    words: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 18,
        textAlign: 'center',
        color: '#b65a76'
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