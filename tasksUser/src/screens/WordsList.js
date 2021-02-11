import React, { useState, useEffect } from 'react'
import { View, FlatList, StyleSheet, Text, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import 'moment/locale/pt-br'

import { showError, server } from '../common'
import Words from '../components/Words'
import Images from '../components/Images'
import commonStyles from '../commonStyles'
import Icon from 'react-native-vector-icons/FontAwesome'


export default function WordsList({ route }) {

    const [words, setWords] = useState([])
    const [images, setImages] = useState([])
    const [tempTaskId, setTempTaskId] = useState(route.params.idTask)
    const [nameTask, setNameTask] = useState('')
    const navigation = useNavigation()

    const notLengthStyle = words.length === 0 && images.length === 0 ? { alignItems: 'center', justifyContent: 'center', paddingTop: 5 } : {  }

    useEffect(() => {
        const componentDidMount = async () => {
            loadItems()
        }

        componentDidMount()
    }, [])


    const loadItems = async () => {
        try {
            /* const maxDate = moment().add({ days: this.props.daysAhead }).format('YYYY-MM-DD 23:59:59') */
            const res = await axios.get(`${server}/wordsTask/${tempTaskId}`)
            const resp = await axios.get(`${server}/images-task/${tempTaskId}`)
            
            if (res.data.length !== 0) {
                setWords(res.data)
            } else if (resp.data.length !== 0) {
                setImages(resp.data)
            }

            await axios(`${server}/task-id/${tempTaskId}`).then(resp => {
                setNameTask(resp.data[0].name)
            })
        } catch (e) {
            showError(e)
        }
    }

    const navigateTo = e => {
        return navigation.navigate('Speech', { id: e.id, word: e.word, desc: '' })
    }

    const navigateToImage = e => {
        return navigation.navigate('Speech', { id: e.id, word: '' , source: `${server}/uploads/${e.image}` })
    }

    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <View style={styles.animatedView}>
                    <Text style={styles.title}>{nameTask}</Text>
                </View>
                <View style={styles.selectView}>
                    <Text style={styles.text}>Selecione um item para iniciar</Text>
                </View>
            </View>
            <View style={[styles.listWords, notLengthStyle]}>

                {words.length !== 0 ? 
                    <FlatList numColumns={2} data={words} keyExtractor={item => `${item.id}`}
                    renderItem={({ item }) => <Words {...item} days={route.params.days}
                        taskId={tempTaskId}
                        size={words.length} onNavigate={navigateTo} />} />
                    : null
                }

                {images.length !== 0 ?
                    <FlatList numColumns={2} data={images} keyExtractor={item => `${item.id}`}
                    renderItem={({ item }) => <Images {...item} days={route.params.days}
                        taskId={tempTaskId}
                        size={images.length} onNavigate={navigateToImage} />} />
                    : null
                }

                {words.length === 0 && images.length === 0 ? 
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name='info-circle' size={50} color='#b65a76' />
                        <Text style={styles.text}>Infelizmente não há nenhum item cadatrado para essa atividade</Text>
                    </View>  
                    : null
                }

            </View>
        </View>
    )
}

// '#0e1627', '#31284c', '#673568', '#a43c74', '#de496e'


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 1,
        backgroundColor: '#FFF',
        borderBottomWidth: 2,
        borderBottomColor: '#b65a76'
    },
    animatedView: {
        backgroundColor: '#b65a76',
        width: '100%',
        height: 145,
        alignItems: 'center',
        justifyContent: 'center'
    },
    listWords: {
        flex: 2,
        backgroundColor: '#FFF',
        paddingTop: 20
    },
    text: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 22,
        color: '#b65a76',
        paddingTop: 30,
        textAlign: 'center'
    },
    selectView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 30,
        color: '#fff'
    }
})