import React, { useState } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Image, Dimensions } from 'react-native'

import commonStyles from '../commonStyles'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'
import { server } from '../common'

export default props => {

    const doneOrNotStyle = props.doneAt != null ? { textDecorationLine: 'line-through', color: '#AAA' } : {  }
    const enableOrDisable = props.days === props.daysAll ? true : false

    const date = props.doneAt ? props.doneAt : props.estimateAt
    const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM')

    const [taskDesc, setTaskDesc] = useState('')

    console.log(props.task_id)

    axios(`${server}/task-id/${props.task_id}`).then(resp => {
        setTaskDesc(resp.data[0].name)
    })

    return (
        <View style={styles.flats}>
            <View style={styles.all}>
                <Text style={styles.taskName}>{taskDesc}</Text>
                <TouchableOpacity style={styles.touch} onPress={() => props.onShow(props.task_id)} 
                    disabled={enableOrDisable}>
                    <View style={styles.container}>
                        {/* <View>
                            {getCheckView(5, 7)}
                        </View> */}
                        <Text style={[styles.text, doneOrNotStyle]}>Iniciar</Text>
                    </View>
                </TouchableOpacity>    
            </View>
            {/* livro PNG foi desenvolvido por miniaria e vem de <a href="https://pt.pngtree.com">Pngtree.com</a> */}
        </View>
    )
}

function getCheckView(days, daysAll) {
    if(days === daysAll) {
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
    flats: {
        width: width,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 30,
    },
    all: {
        width: 345,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
        borderRadius: 20,
        marginBottom: 30,
    },
    touch: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
    },
    container: {
        flexDirection: 'row',
        borderColor: '#de496e',
        width: '100%',
        height: 50,
        /* borderWidth: 2, */
        borderRadius: 8,
        marginTop: 20,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingLeft: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    text: {
        fontFamily: commonStyles.fontFamily,
        color: '#DDD',
        fontSize: 20,
        paddingLeft: 10,
    },
    taskName: {
        fontFamily: commonStyles.fontFamily,
        color: '#DDD',
        fontSize: 20,
        paddingLeft: 10,
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