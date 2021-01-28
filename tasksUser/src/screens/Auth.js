import React, { Component, useContext, useState } from 'react'
import {
    ImageBackground,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

import backgroundImage from '../../assets/imgs/login.jpg'
import logo from '../../assets/imgs/260120211.png'
import commonStyles from '../commonStyles'
import AuthInput from '../components/AuthInput'

import { server, showError, showSuccess } from '../common'
import { AuthContext } from '../Context'

/* import TaskList from './TaskList' */

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false
}

export default function Auth({ navigation }) {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [stageNew, setstageNew] = useState(false)

    const { signIn, signUp } = useContext(AuthContext)

    const signinOrSignup = () => {
        if (stageNew) {
            signUp()
        } else {
            signIn({ email, password })
        }
    }

    const signup = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            })

            showSuccess('Usuário cadastrado!')
            setName('')
            setEmail('')
            setPassword('')
            setConfirmPassword('')
            setstageNew(false)
        } catch (e) {
            showError(e)
        }
    }

    const signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
                email: email,
                password: password
            })

            /* AsyncStorage.setItem('userData', JSON.stringify(res.data))

            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            navigation.navigate("Home", {
                screen: "Home",
                params: res.data,
            }) */
        } catch (e) {
            showError(e)
        }
    }

    const validations = []
    validations.push(email && email.includes('@'))
    validations.push(password && password.length >= 6)

    if (stageNew) {
        validations.push(name && name.trim().length >= 3)
        validations.push(password === confirmPassword)
    }

    const validForm = validations.reduce((t, a) => t && a)

    return (
        <LinearGradient colors={['#0e1627', '#31284c', '#673568', '#a43c74', '#de496e']}
            start={{ x: 0, y: 0 }}
            end={{x: 1, y: 1 }}
            style={styles.background}>
            {/* <Image source={logo} style={styles.logo} /> */}
            {/* <Text style={styles.title}>SpeFono</Text> */}
            <View style={styles.formContainer}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.subtitle}>
                    {stageNew ? 'Crie a sua conta' : 'Informe seus dados'}
                </Text>
                <View style={styles.inputView}>
                    {stageNew && <AuthInput icon='user' placeholder='Nome' placeholderTextColor='#FFF' value={name}
                        style={styles.input} onChangeText={name => setName(name)} />
                    }
                    <AuthInput icon='at' placeholder='E-mail' placeholderTextColor='#FFF' value={email}
                        style={styles.input} onChangeText={email => setEmail(email)} />
                    <AuthInput icon='lock' placeholder='Senha' placeholderTextColor='#FFF'
                        value={password} 
                        style={styles.input} secureTextEntry={true} onChangeText={password => setPassword(password)} />
                    {stageNew &&
                        <AuthInput icon='asterisk'
                            placeholder='Confirmação de Senha' placeholderTextColor='#FFF'
                            value={confirmPassword}
                            style={styles.input} secureTextEntry={true}
                            onChangeText={confirmPassword => setConfirmPassword(confirmPassword)} />
                    }
                </View>
                <TouchableOpacity onPress={signinOrSignup}
                    disabled={!validForm}>
                    <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>
                        <Text style={styles.buttonText}>
                            {stageNew ? 'Registrar' : 'Entrar'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ padding: 10 }} onPress={() => setstageNew(!stageNew)}>
                <Text style={styles.buttonText}>
                    {stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                </Text>
            </TouchableOpacity>
        </LinearGradient>
    )

}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10
    },
    logo: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'center',
        marginBottom: 10
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 20,
        width: '90%',
        height: '60%'
    },
    inputView: {
        backgroundColor: 'rgba(0,0,0,0)',
    },
    input: {
        marginTop: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    }
})

/* import React, { Component, useState } from 'react'
import {
    ImageBackground,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Alert
} from 'react-native'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

import backgroundImage from '../../assets/imgs/login.jpg'
import commonStyles from '../commonStyles'
import AuthInput from '../components/AuthInput'

import { server, showError, showSuccess } from '../common'


const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false
}

export default class Auth extends Component {

    state = {
        ...initialState
    }

    signinOrSignup = () => {
        if(this.state.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    signup = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
            })

            showSuccess('Usuário cadastrado!')
            this.setState({ ...initialState })
        } catch(e) {
            showError(e)
        }
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password
            })

            AsyncStorage.setItem('userData', JSON.stringify(res.data))

            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            this.props.navigation.navigate('Home', {
                screen: 'Home',
                params: res.data,
            })
        } catch(e) {
            showError(e)
        }
    }

    render() {
        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        if(this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim().length >= 3)
            validations.push(this.state.password === this.state.confirmPassword)
        }

        const validForm = validations.reduce((t, a) => t && a)

        return(
            <ImageBackground source={backgroundImage}
                style={styles.background}>
                <Text style={styles.title}>SpeFono</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados'}
                    </Text>
                    {this.state.stageNew && <AuthInput icon='user' placeholder='Nome' value={this.state.name}
                        style={styles.input} onChangeText={name => this.setState({ name })} />
                    }
                    <AuthInput icon='at' placeholder='E-mail' value={this.state.email}
                        style={styles.input} onChangeText={email => this.setState({ email })} />
                    <AuthInput icon='lock' placeholder='Senha' value={this.state.password}
                        style={styles.input} secureTextEntry={true} onChangeText={password => this.setState({ password })} />
                    {this.state.stageNew &&
                        <AuthInput icon='asterisk'
                            placeholder='Confirmação de Senha' value={this.state.confirmPassword}
                            style={styles.input} secureTextEntry={true}
                            onChangeText={confirmPassword => this.setState({ confirmPassword })} />
                    }
                    <TouchableOpacity onPress={this.signinOrSignup}
                        disabled={!validForm}>
                        <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 20,
        width: '90%'
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    }
}) */