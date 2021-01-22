import React, { Component } from 'react'
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'

import moment from 'moment'
import 'moment/locale/pt-br'
import axios from 'axios'

import todayImage from '../../assets/imgs/today.jpg'
import Task from '../components/Task'
import commonStyles from '../commonStyles'
import { showError, server } from '../common'

export default class TaskList extends Component {

    state = {
        tasks: [],
        words: []
    }

    componentDidMount = async () => {
        this.loadTasks()
    }

    loadTasks = async () => {
        try {
            const maxDate = moment().add({ days: 0 }).format('YYYY-MM-DD 23:59:59')
            const res = await axios.get(`${server}/tasksUserId`)
            this.setState({ tasks: res.data })
        } catch(e) {
            showError(e)
        }

    }

    logout = () => {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        this.props.navigation.navigate('AuthOrApp')
    }

    showOrHideScreen = taskId => {
        const tasks = [...this.state.tasks]

        tasks.forEach(task => {
            if(task.id === taskId) {
                this.props.navigation.navigate('WordsList', { idTask: task.id })
            }
        })
    }

    render() {
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

        return (
            <View style={styles.container}>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.logoutStyle}>
                        <TouchableOpacity onPress={this.logout}>
                            <View style={styles.logoutIcon}>
                                <Icon name='sign-out' size={30} color='#FFF' />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.tasklist}>
                    <FlatList data={this.state.tasks} keyExtractor={item => `${item.id}`} 
                        renderItem={({item}) => <Task {...item} onShow={this.showOrHideScreen} />} /> 
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
        flex: 3
    },
    tasklist: {
        flex: 7
    },
    titleBar: {
        flex: 3,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    logoutStyle: {
        flex: 1,
        marginTop: 10,
        marginRight: 10,
        alignItems: 'flex-end'
    },
    logoutIcon: {
        marginLeft: 10,
        marginBottom: 10,
        justifyContent: 'center'
    }
})
/* export default class TaskList extends Component {

    state = {
        tasks: [],
        words: []
    }

    componentDidMount = async () => {
        this.loadTasks()
    }

    loadTasks = async () => {
        try {
            const maxDate = moment().add({ days: 0 }).format('YYYY-MM-DD 23:59:59')
            const res = await axios.get(`${server}/tasksUserId`)
            this.setState({ tasks: res.data })
        } catch(e) {
            showError(e)
        }
        // chamada do método estava comentado
        this.changeDoneAt()
    }

    // Método estava comentado
    changeDoneAt = async () => {

        const tasks = [...this.state.tasks]

        for(const task of tasks) {
            try{
                const res = await axios.get(`${server}/words/${task.id}/verifyNull`)
                this.setState({ words: res.data })
            } catch(e) {
                showError(e)
            }
            
            if(this.state.words.length === 0) {
                try{
                    await axios.put(`${server}/tasks/${task.id}/toggle`)
                } catch(e) {
                    showError(e)
                }
            }
            this.setState({ words: [] })
        }

         tasks.forEach(async task => {
            try{
                const res = await axios.get(`${server}/words/${task.id}/verifyNull`)
                this.setState({ words: res.data })
            } catch(e) {
                showError(e)
            }
            
            if(this.state.words.length === 0) {
                try{
                    await axios.put(`${server}/tasks/${task.id}/toggle`)
                } catch(e) {
                    showError(e)
                }
            }
            this.setState({ words: [] })
        }) 

        this.setState(this.state)
    }

    logout = () => {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        this.props.navigation.navigate('AuthOrApp')
    }

    showOrHideScreen = taskId => {
        const tasks = [...this.state.tasks]

        tasks.forEach(task => {
            if(task.id === taskId) {
                this.props.navigation.navigate('WordsList', { idTask: task.id })
            }
        })
    }

    render() {
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

        return (
            <View style={styles.container}>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.logoutStyle}>
                        <TouchableOpacity onPress={this.logout}>
                            <View style={styles.logoutIcon}>
                                <Icon name='sign-out' size={30} color='#FFF' />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.tasklist}>
                    <FlatList data={this.state.tasks} keyExtractor={item => `${item.id}`} 
                        renderItem={({item}) => <Task {...item} onShow={this.showOrHideScreen} />} /> 
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
        flex: 3
    },
    tasklist: {
        flex: 7
    },
    titleBar: {
        flex: 3,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    logoutStyle: {
        flex: 1,
        marginTop: 10,
        marginRight: 10,
        alignItems: 'flex-end'
    },
    logoutIcon: {
        marginLeft: 10,
        marginBottom: 10,
        justifyContent: 'center'
    }
}) */