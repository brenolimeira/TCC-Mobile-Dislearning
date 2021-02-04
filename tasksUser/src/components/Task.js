import React, { useState } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native'

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

    axios(`${server}/task-id/${props.taskId}`).then(resp => {
        setTaskDesc(resp.data[0].name)
    })

    return (
        <View style={{ backgroundColor: '#18284b' }}>
            <TouchableOpacity style={styles.touch} onPress={() => props.onShow(props.taskId)} 
                disabled={enableOrDisable}>
                <View style={styles.container}>
                    {/* <View>
                        {getCheckView(5, 7)}
                    </View> */}
                    <Text style={[styles.text, doneOrNotStyle]}>{taskDesc}</Text>
                </View>
            </TouchableOpacity>
            {/* livro PNG foi desenvolvido por miniaria e vem de <a href="https://pt.pngtree.com">Pngtree.com</a> */}
            <Image style={styles.image} source={require('../../assets/imgs/—Pngtree—children.png')} />
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

const styles = StyleSheet.create({
    touch: {
        alignItems: 'center'
    },
    container: {
        flexDirection: 'column',
        borderColor: '#de496e',
        width: '95%',
        height: 200,
        /* borderWidth: 2, */
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 10,
        paddingLeft: 10,
        backgroundColor: '#0e1627'
    },
    image: {
        position: 'absolute',
        marginTop: 5,
        marginLeft: 150,
        width: 110,
        height: 100
    },
    text: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
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