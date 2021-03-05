import React, { useState } from 'react';
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
/* import Voice from 'react-native-voice'; */
import Voice from '@react-native-community/voice'
import axios from 'axios'
import { showError, server } from '../common'

import Icon from 'react-native-vector-icons/FontAwesome'
import commonStyles from '../commonStyles'
import { useNavigation } from '@react-navigation/native';

import AudioRecorderPlayer, {
	AVEncoderAudioQualityIOSType,
	AVEncodingOption,
	AudioEncoderAndroidType,
	AudioSet,
	AudioSourceAndroidType,
} from 'react-native-audio-recorder-player'

export default function Speech({ route }) {

	const [error, setError] = useState('')
	const [end, setEnd] = useState('')
	const [started, setStarted] = useState('')
	const [results, setResults] = useState('')

	const [recordSec, setRecordsSec] = useState(0)
	const [recordTime, setRecordTime] = useState('00:00:00')
	const [record, setRecord] = useState(false)

	const audioRecorderPlayer = new AudioRecorderPlayer()

	const navigation = useNavigation()

	const onStartRecord = async () => {
		const path = `sdcard/Download/${Date.now()}.mp3`

		const audioSet = {
			AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
			AudioSourceAndroid: AudioSourceAndroidType.MIC,
			AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
			AVNumberOfChannelsKeyIOS: 2,
			AVFormatIDKeyIOS: AVEncodingOption.aac,
		}
		console.log('audioSet', audioSet)

		const uri = await audioRecorderPlayer.startRecorder(path, audioSet)

		setRecord(true)

		audioRecorderPlayer.addRecordBackListener(e => {
			setRecordsSec(e.current_position),
				setRecordTime(audioRecorderPlayer.mmssss(
					Math.floor(e.current_position)
				))
		})

		console.log(`uri: ${uri}`)
	}

	const onStopRecord = async () => {
		const result = await audioRecorderPlayer.stopRecorder()
		audioRecorderPlayer.removeRecordBackListener()

		setRecord(false)
		setRecordsSec(0)

		navigation.navigate('Home')

		console.log(result)
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				<View style={styles.msg}>
					{route.params.word !== '' ?
						<Text style={styles.instructions}>
							Que palavra é essa ?
						</Text>
						:
						<Text style={styles.instructions}>
							O que tem na imagem ?
						</Text>
					}
				</View>
				<View style={styles.item}>
					{route.params.word !== '' ?
						<Text style={styles.welcome}>
							{route.params.word}
						</Text>
						:
						<Image style={styles.image} source={{
							uri: route.params.source
						}} />
					}
				</View>
				<View style={styles.buttonMicro}>
					<Text style={{ textAlign: 'center', fontSize: 20, color: '#b65a76' }} >{started}</Text>
					<TouchableHighlight
						onPress={() => {
							record ? onStopRecord() : onStartRecord()
						}}
						/* style={{ marginVertical: 20 }} */>
						<View style={styles.button}>
							{record ? (
								<Icon name='stop-circle' size={80} color='#b65a76' />
							) : (
								<Icon name='play-circle' size={80} color='#b65a76' />
							)}
						</View>
					</TouchableHighlight>
					<Text style={styles.startText}>{record ? 'Finalizar': 'Iniciar'}</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	button: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: '#FFF',
	},
	item: {
		flex: 2,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	msg: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#b65a76',
		width: '100%'
	},
	buttonMicro: {
		flex: 0.8,
		justifyContent: 'flex-end'
	},
	startText: {
		fontSize: 20,
		textAlign: 'center',
		color: '#b65a76',
		paddingBottom: 10
	},
	welcome: {
		fontSize: 40,
		textAlign: 'center',
		color: '#b65a76'
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
		fontSize: 30,
		textAlign: 'center',
		color: '#FFF',
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