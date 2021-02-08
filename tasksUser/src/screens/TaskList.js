import React, { useEffect, useState, useContext, useLayoutEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Animated, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'

import moment from 'moment'
import 'moment/locale/pt-br'
import axios from 'axios'

import todayImage from '../../assets/imgs/today.jpg'
import Task from '../components/Task'
import commonStyles from '../commonStyles'
import { server } from '../common'

import { AuthContext } from '../Context'

const { width, height } = Dimensions.get('screen')

export default function TaskList({ navigation }) {

    const [tasks, setTasks] = useState([])

    const { signOut, logged } = useContext(AuthContext)

    const scrollx = React.useRef(new Animated.Value(0)).current

    useEffect(() => {
        /* logged() */
        /* AsyncStorage.removeItem('itemsTask') */
        loadTasks()
    }, [tasks.id])

    const Indicator = ({ scrollx }) => {
        return (
            <View style={{ position: 'absolute', bottom: 1, flexDirection: 'row' }}>
                {tasks.map((task, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
                    const scale = scrollx.interpolate({
                        inputRange,
                        outputRange: [0.8, 1.4, 0.8],
                        extrapolate: 'clamp'
                    })

                    const opacity = scrollx.interpolate({
                        inputRange,
                        outputRange: [0.6, 0.9, 0.6],
                        extrapolate: 'clamp'
                    })
                    return (
                        <Animated.View
                            key={`Indicator-${task.id}`}
                            style={{
                                height: 10,
                                width: 10,
                                borderRadius: 5,
                                backgroundColor: '#ddd',
                                margin: 10,
                                transform: [{
                                    scale
                                }],
                                opacity
                            }} />
                    )
                })}
            </View>
        )
    }

    const Square = ({ scrollx }) => {
        return (
            <Animated.View
                style={{
                    width: height,
                    height: height,
                    backgroundColor: '#fff',
                    borderRadius: 86,
                    position: 'absolute',
                    top: -height * 0.7,
                    left: -height * 0.4,
                    transform: [{
                        rotate: '20deg'
                    }]
                }} />
        )
    }

    const loadTasks = async () => {
        try {
            await axios(`${server}/task-search-user`).then(resp => {
                setTasks(resp.data)
            })
            /* Alert.alert('aqui2') */
            /* await axios.get(`${server}/task-id/${res.data.id}`) */
        } catch (e) {
            /* showError(e) */
        }

    }

    const logout = () => {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        AsyncStorage.removeItem('userToken')
        /* navigation.navigate('AuthOrApp') */
        signOut()
    }

    const showOrHideScreen = taskId => {
        const tasks1 = [...tasks]

        /* const res = axios.get(`${server}/wordsTask/${taskId}`)

        AsyncStorage.setItem('itemsTask', JSON.stringify(res.data))
        AsyncStorage.setItem('list', 0)

        navigation.navigate('Speech') */

        tasks1.forEach(task => {
            if (task.taskId === taskId) {
                navigation.navigate('WordsList', { idTask: task.taskId, days: task.daysAll })
                /* this.props.navigation.push('WordsList', { idTask: task.id }) */
            }
        })
    }
    const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

    return (
        <View style={styles.container}>
            {/* <View style={styles.background}>
                <View style={styles.logoutStyle}>
                    <TouchableOpacity onPress={logout}>
                        <View style={styles.logoutIcon}>
                            <Icon name='sign-out' size={30} color='#FFF' />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>Hoje</Text>
                    <Text style={styles.subtitle}>{today}</Text>
                </View>
            </View> */}
            <Square scrollx={scrollx} />
            <TouchableOpacity style={styles.logoutTest} onPress={logout}>
                <View style={styles.logoutIcon}>
                    <Icon name='sign-out' size={30} color='#b65a76' />
                </View>
            </TouchableOpacity>
            <Image style={styles.image} source={require('../../assets/imgs/—Pngtree—children.png')} />
            <Text style={styles.text}>Tarefas</Text>
            <Animated.FlatList data={tasks} keyExtractor={item => `${item.id}`}
                horizontal scrollEventThrottle={32} pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollx } } }],
                    { useNativeDriver: false }
                )}
                renderItem={({ item }) => <Task {...item} onShow={showOrHideScreen} />} />
            <Indicator scrollx={scrollx} />
            {/* <View style={styles.tasklist}> */}
            {/* <Backdrop scrollx={scrollx} /> */}
            {/* </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b65a76',
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        flex: 2,
        backgroundColor: '#de496e'
    },
    tasklist: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
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
    text: {
        position: 'relative',
        top: 350,
        color: '#DDD',
        fontFamily: commonStyles.fontFamily,
        fontSize: 30,
        fontWeight: 'bold'
    },
    logoutStyle: {
        position: 'absolute',
        top: 200,
        width: 30,
        height: 30
    },
    logoutIcon: {
        marginLeft: 10,
        marginBottom: 10,
    },
    image: {
        position: 'absolute',
        top: 90,
        marginTop: 5,
        marginLeft: 150,
        width: 140,
        height: 210
    },
    logoutTest: {
        position: 'absolute',
        top: 10,
        right: 10,
        marginTop: 5,
        marginLeft: 20,
    },
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