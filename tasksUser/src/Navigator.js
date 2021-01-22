import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import React from 'react'

import Auth from './screens/Auth'
import AuthOrApp from './screens/AuthOrApp'
import TaskList from './screens/TaskList'
import Speech from './screens/Speech'
import WordsList from './screens/WordsList'
import NavigationTab from './NavigationTab'

import commonStyles from './commonStyles'

const mainRoutes = {
    AuthOrApp: {
        name: 'AuthOrApp',
        screen: AuthOrApp
    },
    Auth: {
        name: 'Auth',
        screen: Auth
    },
    Home: {
        name: 'Home',
        screen: TaskList
    },
    Speech: {
        name: 'Speech',
        screen: Speech
    },
    WordsList: {
        name: 'Words',
        screen: WordsList
    },
    NavigationTab: {
        name: 'NavigationTab',
        screen: NavigationTab
    }
}

const mainNavigator = createSwitchNavigator(mainRoutes, {
    initialRouteName: 'AuthOrApp'
})

export default createAppContainer(mainNavigator)