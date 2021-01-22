import React, { Component } from 'react'
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Alert } from 'react-native'
import
 MaterialCommunityIcons
from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  NavigationContainer
} from '@react-navigation/native';
import {
  createStackNavigator
} from '@react-navigation/stack';
import {
  createMaterialBottomTabNavigator
} from '@react-navigation/material-bottom-tabs';

import TaskList from './screens/TaskList'
import { BottomNavigation } from 'react-native-paper';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default class NativationTab extends Component {

    state = {
        index: 0,
        routes: [
            {key: 'tasklist', title: 'TaskList', icon: 'history'}
        ]
    }

    renderScene = BottomNavigation.SceneMap({
        tasklist: TaskList
    })

    render() {
        return (
            <BottomNavigation 
                navigationState={this.state.index, this.state.routes} 
                onIndexChange={this.state.index}
                renderScene={this.renderScene} />
        )
    }
}


