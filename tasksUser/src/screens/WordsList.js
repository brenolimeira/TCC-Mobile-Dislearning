import React, { useState, useEffect } from 'react'
import { View, FlatList, StyleSheet, Animated, Text, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/pt-br'

import { showError, server } from '../common'
import Words from '../components/Words'
import wordsRepeat from '../../assets/imgs/toy-story.jpg'
import commonStyles from '../commonStyles'

const { width, height } = Dimensions.get('screen')

export default function WordsList({ route }) {

    const [words, setWords] = useState([])
    const [tempTaskId, setTempTaskId] = useState(route.params.idTask)
    const navigation = useNavigation()

    useEffect(() => {

        const componentDidMount = async () => {
            loadWords()
        }

        componentDidMount()
        /* words.shift() */
    }, [])


    const loadWords = async () => {
        try {
            /* const maxDate = moment().add({ days: this.props.daysAhead }).format('YYYY-MM-DD 23:59:59') */
            const res = await axios.get(`${server}/wordsTask/${tempTaskId}`)
            setWords(res.data)
        } catch (e) {
            showError(e)
        }
    }

    const navigateTo = e => {
        return navigation.navigate('Speech', { id: e.id, word: e.word })
    }

    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <View style={styles.animatedView}>
                    <Text style={styles.title}>Teste</Text>
                </View>
                <View style={styles.rectangleBottom}></View>
            </View>
            <View style={styles.listWords}>
                <Text style={styles.text}>Selecione um item para iniciar</Text>
                <FlatList numColumns={2} data={words} keyExtractor={item => `${item.id}`}
                    renderItem={({ item }) => <Words {...item} days={route.params.days}
                        taskId={tempTaskId}
                        size={words.length} onNavigate={navigateTo} />} />
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
    },
    animatedView: {
        backgroundColor: '#b65a76',
        width: '100%',
        height: 145,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rectangleBottom: {
        position: "absolute",
        left: -15,
        bottom: 60,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#b65a76',
        /* borderBottomWidth: 200,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderBottomColor: "#000",
        borderLeftWidth: 100,
        borderLeftColor: "#b65a76",
        borderRightWidth: 100,
        borderRightColor: "#b65a76",
        transform: [
            { rotate: '60deg' }
        ] */
    },
    listWords: {
        flex: 2,
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    text: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 18,
        color: '#b65a76',
        marginTop: 10,
        marginBottom: 10
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 18,
        color: '#fff'
    }
})


/* import React, { Component } from 'react'
import { View, FlatList, StyleSheet, ImageBackground, Alert } from 'react-native'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/pt-br'

import { showError, server } from '../common'
import Words from '../components/Words'
import wordsRepeat from '../../assets/imgs/toy-story.jpg'


export default class WordsList extends Component {

    state = {
        words: [],
        wordsId: [],
        tempTaskId: this.props.navigation.state.params,
    }

    componentDidMount = async () => {
        this.loadWords()
    }

    loadWords = async () => {
        try {
            const maxDate = moment().add({ days: this.props.daysAhead }).format('YYYY-MM-DD 23:59:59')
            const res = await axios.get(`${server}/wordsTask/${this.state.tempTaskId.idTask}`)
            this.setState({ words: res.data })
        } catch(e) {
            showError(e)
        }
    }

    navigateTo = e => {
        return this.props.navigation.navigate('Speech', {...e})
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={wordsRepeat} style={styles.background}>

                </ImageBackground>
                <View style={styles.listWords}>
                    <FlatList data={this.state.words} keyExtractor={item => `${item.id}`}
                        renderItem={({ item }) => <Words {...item} onNavigate={this.navigateTo} />} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 1
    },
    listWords: {
        flex: 2
    }
}) */