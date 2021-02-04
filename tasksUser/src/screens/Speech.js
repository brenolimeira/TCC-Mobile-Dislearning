import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	Alert,
	TouchableHighlight,
	ScrollView,
	Image
} from 'react-native';
import Voice from 'react-native-voice';
import axios from 'axios'
import { showError, server } from '../common'

import Icon from 'react-native-vector-icons/FontAwesome'
import commonStyles from '../commonStyles'
import { useNavigation } from '@react-navigation/native';

export default function Speech({ route }) {

	const [error, setError] = useState('')
	const [end, setEnd] = useState('')
	const [started, setStarted] = useState('')
	const [results, setResults] = useState('')
	/* const [params, setParams] = useState(route.params) */

	const navigation = useNavigation()

	useEffect(() => {
		function onSpeechStart(e) {
			console.log('onSpeechStart: ', e)
			setStarted('√')
		}

		function onSpeechResults(e) {
			console.log('onSpeechResults: ', e)
			setResults(e.value)
		}

		function onSpeechEnd(e) {
			console.log('onSpeechEnd: ', e)
			setEnd('√')
	
			Alert.alert('Sucesso!', `Tarefa concluída!`)
			verifyWordsEquals()
			changeDoneAt()
			// Acho que terá que navegar para Auth or App
			// this.props.navigation.navigate('AuthOrApp')
			navigation.navigate('Home')
		}
	
		function onSpeechError(e) {
			console.log('onSpeechError: ', e)
			setError(JSON.stringify(e.error))
	
			Alert.alert('Erro Voz!', 'Problema ao reconhecer a voz! Tente novamente...')
		}

		Voice._onSpeechStart = onSpeechStart
		Voice._onSpeechResults = onSpeechResults
		Voice._onSpeechEnd = onSpeechEnd
		Voice._onSpeechError = onSpeechError

		return () => {
			Voice.destroy().then(Voice.removeAllListeners)
		}

	}, [])

	const _startRecognizing = async () => {
		setError('')
		setStarted('')
		setResults('')
		setEnd('')

		try {
			await Voice.start('pt-BR')
		} catch (e) {
			console.error(e);
		}
	}

	const _cancelRecognizing = async () => {
		try {
			await Voice.cancel()
		} catch (e) {
			console.error(e);
		}
		// Acho que terá que navegar para Auth or App
		// this.props.navigation.navigate('AuthOrApp')
		navigation.navigate('Home')
	}

	const _destroyRecognizer = async () => {
		try {
			await Voice.destroy()
		} catch (e) {
			console.error(e)
		}
		setError('')
		setStarted('')
		setResults('')
		setEnd('')

	}

	const changeDoneAt = async () => {
		try {
			await axios.put(`${server}/words/${route.params.id}/${route.params.taskId}/toggle`)
		} catch (e) {
			showError(e)
		}
	}

	const verifyWordsEquals = async () => {
		if (results === params.word) {
			try {
				await axios.put(`${server}/words/${route.params.id}/correct/${route.params.taskId}/toggle`)
			} catch (e) {
				showError(e)
			}
		} else {
			try {
				await axios.put(`${server}/words/${route.params.id}/wrong/${route.params.taskId}/toggle`)
			} catch (e) {
				showError(e)
			}
		}
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				{/* {this.state.params.word != '' ? 
						<Image style={styles.image} source={this.state.params.image} /> : 
						<Text style={styles.welcome}>
							{this.state.params.word}
						</Text> } */}
				<Text style={styles.welcome}>
					{route.params.word}
				</Text>
				<Text style={styles.instructions}>
					Clique no microfone para começar a tarefa
						</Text>
				<View
					style={styles.titleStartEnd}>
					<Text style={styles.startedText}>
						{`Iniciado: ${started}`}
					</Text>
					<Text style={styles.endText}>
						{`Finalizado: ${end}`}
					</Text>
				</View>
				<View style={styles.space} />
				<TouchableHighlight
					onPress={_startRecognizing}
					style={{ marginVertical: 20 }}>
					<View style={styles.button}>
						<Icon name='microphone' size={30} color='#FFF' />
					</View>
				</TouchableHighlight>
				<Text style={styles.stat}>Resultado</Text>
				<ScrollView style={{ marginBottom: 42 }}>
					{/* {this.state.results.map((result, index) => {
							return (
								<Text key={`result-${index}`} style={styles.stat}>
									{result}
								</Text>
							);
						})} */}
					<Text style={styles.stat}>
						{results}
					</Text>
				</ScrollView>
				<View style={styles.buttonCancel}>
					<TouchableHighlight
						onPress={_cancelRecognizing}
						style={{ flex: 1, backgroundColor: 'red' }}>
						<Text style={styles.action}>Voltar</Text>
					</TouchableHighlight>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	button: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#B0171F',
		justifyContent: 'center',
		alignItems: 'center'
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	action: {
		width: '100%',
		textAlign: 'center',
		color: 'white',
		paddingVertical: 8,
		marginVertical: 5,
		fontWeight: 'bold',
	},
	instructions: {
		fontFamily: commonStyles.fontFamily,
		fontSize: 20,
		textAlign: 'center',
		color: '#333333',
		marginBottom: 50,
	},
	stat: {
		textAlign: 'center',
		color: '#B0171F',
		marginBottom: 1,
		marginTop: 30,
	},
	image: {
		height: 200,
		width: 200,
		marginBottom: 30,
		marginTop: 10
	},
	startedText: {
		flex: 1,
		fontFamily: commonStyles.fontFamily,
		textAlign: 'center',
		color: '#B0171F',
	},
	endText: {
		flex: 1,
		fontFamily: commonStyles.fontFamily,
		textAlign: 'center',
		color: '#B0171F',
	},
	titleStartEnd: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 10,
	},
	space: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 10,
	},
	buttonCancel: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		position: 'absolute',
		bottom: 0,
	}
});
/* import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	Alert,
	TouchableHighlight,
	ScrollView,
	Image
} from 'react-native';
import Voice from 'react-native-voice';
import axios from 'axios'
import { showError, server } from '../common'

import Icon from 'react-native-vector-icons/FontAwesome'
import commonStyles from '../commonStyles'

export default class Speech extends Component {
	state = {
		error: '',
		end: '',
		started: '',
		results: '',
		params: this.props.navigation.state.params
	}

	constructor(props) {
		super(props);
		Voice.onSpeechStart = this.onSpeechStart
		Voice.onSpeechEnd = this.onSpeechEnd
		Voice.onSpeechError = this.onSpeechError
		Voice.onSpeechResults = this.onSpeechResults
	}

	componentWillUnmount() {
		Voice.destroy().then(Voice.removeAllListeners)
	}

	onSpeechStart = e => {
		console.log('onSpeechStart: ', e)
		this.setState({
			started: '√',
		})
	}

	onSpeechEnd = e => {
		console.log('onSpeechEnd: ', e)
		this.setState({ end: '√' })

		Alert.alert('Sucesso!', `Tarefa concluída!`)
		this.verifyWordsEquals()
		this.changeDoneAt()
		// Acho que terá que navegar para Auth or App
		// this.props.navigation.navigate('AuthOrApp')
		this.props.navigation.navigate('Home')
	}

	onSpeechError = e => {
		console.log('onSpeechError: ', e)
		this.setState({
			error: JSON.stringify(e.error),
		})
		Alert.alert('Erro Voz!', 'Problema ao reconhecer a voz! Tente novamente...')
	}

	onSpeechResults = e => {
		console.log('onSpeechResults: ', e)
		this.setState({
			results: e.value,
		})
	}

	_startRecognizing = async () => {
		this.setState({
			error: '',
			started: '',
			results: '',
			end: '',
		})

		try {
			await Voice.start('pt-BR')
		} catch (e) {
			console.error(e);
		}
	}

	_cancelRecognizing = async () => {
		try {
			await Voice.cancel()
		} catch (e) {
			console.error(e);
		}
		// Acho que terá que navegar para Auth or App
		// this.props.navigation.navigate('AuthOrApp')
		this.props.navigation.navigate('Home')
	}

	_destroyRecognizer = async () => {
		try {
			await Voice.destroy()
		} catch (e) {
			console.error(e)
		}
		this.setState({
			error: '',
			started: '',
			results: '',
			end: '',
		})
	}

	changeDoneAt = async () => {
		try {
			await axios.put(`${server}/words/${this.state.params.id}/${this.state.params.taskId}/toggle`)
		} catch(e) {
			showError(e)
		}
	}

	verifyWordsEquals = async () => {
		if(this.state.results === this.state.params.word) {
			try{
				await axios.put(`${server}/words/${this.state.params.id}/correct/${this.state.params.taskId}/toggle`)
			} catch(e) {
				showError(e)
			}
		} else {
			try{
				await axios.put(`${server}/words/${this.state.params.id}/wrong/${this.state.params.taskId}/toggle`)
			} catch(e) {
				showError(e)
			}
		}
	}

	render() {

		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container}>
					{/* {this.state.params.word != '' ?
						<Image style={styles.image} source={this.state.params.image} /> :
						<Text style={styles.welcome}>
							{this.state.params.word}
						</Text> }
					<Text style={styles.welcome}>
						{this.state.params.word}
					</Text>
					<Text style={styles.instructions}>
						Clique no microfone para começar a tarefa
						</Text>
					<View
						style={styles.titleStartEnd}>
						<Text style={styles.startedText}>
							{`Iniciado: ${this.state.started}`}
						</Text>
						<Text style={styles.endText}>
							{`Finalizado: ${this.state.end}`}
						</Text>
					</View>
					<View style={styles.space} />
					<TouchableHighlight
						onPress={this._startRecognizing}
						style={{ marginVertical: 20 }}>
						<View style={styles.button}>
							<Icon name='microphone' size={30} color='#FFF' />
						</View>
					</TouchableHighlight>
					<Text style={styles.stat}>Resultado</Text>
					<ScrollView style={{ marginBottom: 42 }}>
						{/* {this.state.results.map((result, index) => {
							return (
								<Text key={`result-${index}`} style={styles.stat}>
									{result}
								</Text>
							);
						})}
						<Text style={styles.stat}>
							{this.state.results}
						</Text>
					</ScrollView>
					<View style={styles.buttonCancel}>
						<TouchableHighlight
							onPress={this._cancelRecognizing}
							style={{ flex: 1, backgroundColor: 'red' }}>
							<Text style={styles.action}>Voltar</Text>
						</TouchableHighlight>
					</View>
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#B0171F',
		justifyContent: 'center',
		alignItems: 'center'
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	action: {
		width: '100%',
		textAlign: 'center',
		color: 'white',
		paddingVertical: 8,
		marginVertical: 5,
		fontWeight: 'bold',
	},
	instructions: {
		fontFamily: commonStyles.fontFamily,
		fontSize: 20,
		textAlign: 'center',
		color: '#333333',
		marginBottom: 50,
	},
	stat: {
		textAlign: 'center',
		color: '#B0171F',
		marginBottom: 1,
		marginTop: 30,
	},
	image: {
		height: 200,
		width: 200,
		marginBottom: 30,
		marginTop: 10
	},
	startedText: {
		flex: 1,
		fontFamily: commonStyles.fontFamily,
		textAlign: 'center',
		color: '#B0171F',
	},
	endText: {
		flex: 1,
		fontFamily: commonStyles.fontFamily,
		textAlign: 'center',
		color: '#B0171F',
	},
	titleStartEnd: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 10,
	},
	space: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 10,
	},
	buttonCancel: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		position: 'absolute',
		bottom: 0,
	}
}); */