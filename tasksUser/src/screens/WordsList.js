import React, { useState, useEffect } from 'react'
import { View, FlatList, StyleSheet, ImageBackground, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/pt-br'

import { showError, server } from '../common'
import Words from '../components/Words'
import wordsRepeat from '../../assets/imgs/toy-story.jpg'


export default function WordsList({ route }) {

    const [words, setWords] = useState([])
    const [tempTaskId, setTempTaskId] = useState(route.params.idTask)
    const navigation = useNavigation()

    useEffect(() => {

        const componentDidMount = async () => {
            loadWords()
        }

        componentDidMount()
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
            <ImageBackground source={wordsRepeat} style={styles.background}>

            </ImageBackground>
            <View style={styles.listWords}>
                <FlatList data={words} keyExtractor={item => `${item.id}`}
                    renderItem={({ item }) => <Words {...item} onNavigate={navigateTo} />} />
            </View>
        </View>
    )
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