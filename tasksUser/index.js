/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
/* import Speech from './src/screens/Speech' */
import Navigator from './src/Navigator'
import NavigationTab from './src/NavigationTab'
import Context from './src/Context'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => NavigationTab);
