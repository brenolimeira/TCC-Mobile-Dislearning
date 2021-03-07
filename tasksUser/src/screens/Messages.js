import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import axios from 'axios'
import { server, showError } from '../common'
import socketIOCLient from 'socket.io-client'
import moment from 'moment'
import commonStyles from '../commonStyles'

export default function Messages() {

    const [messageSend, setMessageSend] = useState('')
    const [messages, setMessages] = useState([])
    const [user, setUser] = useState([])
    const scrollRef = useRef()
    const socketRef = useRef()

    useEffect(() => {
        socketRef.current = socketIOCLient(server)

        socketRef.current.on("chat messages", message => {
            setMessages(message)
        })

        return () => {
            socketRef.current.disconnect()
        }
    }, [messages.length])

    useEffect(() => {
        axios(`${server}/messages-patient`).then(resp => {
            setMessages(resp.data)
        })

        axios(`${server}/user-by-id`).then(resp => {
            setUser(resp.data)
        })

        scrollRef.current.scrollToEnd({ animated: true })

    }, [messages.length])

    const sendMessages = () => {

        socketRef.current.emit("chat messages", {
            createdAt: new Date(),
            text: messageSend,
            type_sender: 'patient',
            patient_id: user.id,
            fono_id: 1
        })

        /* try {
            await axios.post(`${server}/message-send-patient`, {
                createdAt: new Date(),
                text: messageSend,
                type_sender: 'patient',
                fono_id: 1
            })

            axios(`${server}/messages-patient`).then(resp => {
                setMessages(resp.data)
            })
        } catch (e) {
            showError(e)
        } */
        setMessageSend('')
    }

    return (
        <View style={styles.container}>
            <View style={styles.messages}>
                <ScrollView ref={scrollRef}>
                    {messages.map(msg => {
                        return (
                            <View key={msg.id}>
                                <View style={msg.type_sender === 'patient' ? styles.msgs_sent : styles.msgs_received}>
                                    <Text style={msg.type_sender === 'patient' ? styles.msg_sent : styles.msg_received}>
                                        {msg.text}
                                    </Text>
                                </View>
                                <View style={msg.type_sender === 'patient' ? styles.msgs_sent : styles.msgs_received}>
                                    <Text style={styles.date}>{moment(msg.createdAt).format('DD/MM HH:mm')}</Text>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
            <View style={styles.inputs}>
                <TextInput style={styles.textInput} placeholder="Digite uma mensagem" value={messageSend}
                    onChangeText={msg => setMessageSend(msg)} />
                <TouchableOpacity disabled={messageSend !== '' ? false : true} style={styles.buttonInput}
                    onPress={sendMessages}>
                    <Ionicons style={styles.icon} name='send' size={30} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    messages: {
        flex: 8,
        backgroundColor: '#FFF'
    },
    inputs: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: 10
    },
    textInput: {
        backgroundColor: 'rgba(30,45,80,0.3)',
        borderRadius: 20,
        width: '85%'
    },
    buttonInput: {
        borderWidth: 1,
        borderRadius: 25,
        marginLeft: 5,
        backgroundColor: '#b65a76'
    },
    icon: {
        padding: 5
    },
    msgs_sent: {
        flexDirection: 'row-reverse',
    },
    msgs_received: {
        flexDirection: 'row'
    },
    msg_sent: {
        fontFamily: commonStyles.fontFamily,
        marginRight: 5,
        marginTop: 5,
        lineHeight: 24,
        padding: 10,
        borderRadius: 25,
        position: 'relative',
        color: '#FFF',
        backgroundColor: '#b65a76',
        textAlign: 'center'
    },
    msg_received: {
        fontFamily: commonStyles.fontFamily,
        marginLeft: 5,
        marginTop: 5,
        lineHeight: 24,
        padding: 10,
        borderRadius: 25,
        position: 'relative',
        color: '#FFF',
        backgroundColor: 'gray',
        textAlign: 'center'
    },
    date: {
        fontSize: 12,
        padding: 5,
        fontFamily: commonStyles.fontFamily
    }
})