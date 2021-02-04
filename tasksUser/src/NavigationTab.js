import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Ionicons from 'react-native-vector-icons/Ionicons'

import Auth from './screens/Auth'
import TaskList from './screens/TaskList'
import Notifications from './screens/Notifications'
import WordsList from './screens/WordsList'
import Speech from './screens/Speech'
import Loading from './screens/Loading'
import { showError, server } from './common'
import { AuthContext } from './Context'
import { Alert } from 'react-native'

const AuthStack = createStackNavigator()
const Tabs = createBottomTabNavigator()
const HomeStack = createStackNavigator()
const NotificationsStack = createStackNavigator()
const Drawer = createDrawerNavigator()

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={TaskList} />
    <HomeStack.Screen name="WordsList" component={WordsList} />
    <HomeStack.Screen name="Speech" component={Speech} />
  </HomeStack.Navigator>
)

const NotificationsStackScreen = () => (
  <NotificationsStack.Navigator>
    <NotificationsStack.Screen name="Notifications" component={Notifications} />
  </NotificationsStack.Navigator>
)

const TabsScreen = () => (
  <Tabs.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Início') {
          iconName = focused
            ? 'ios-home'
            : 'ios-home-outline'
        } else if (route.name === 'Notificações') {
          iconName = focused
            ? 'notifications'
            : 'notifications-outline'
        }

        return <Ionicons name={iconName} size={size} color={color} />
      }
    })}
    tabBarOptions={{
      activeTintColor: '#dddddd',
      inactiveTintColor: '#dddddd',
      style: {
        backgroundColor: '#b65a76'
      }
    }} >
    <Tabs.Screen name="Início" component={TaskList} />
    <Tabs.Screen name="Notificações" component={Notifications} />
  </Tabs.Navigator>
)

export default function NavigationTab({ navigation }) {

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        case 'LOGGED':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            isLoading: true,
          }
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null
    }
  )

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken')
      } catch (e) {

      }
      axios.defaults.headers.common['Authorization'] = `bearer ${userToken}`

      dispatch({ type: 'RESTORE_TOKEN', token: userToken })
    }

    bootstrapAsync()
  }, [])

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        try {
          const res = await axios.post(`${server}/signin`, {
            email: data.email,
            password: data.password
          })

          AsyncStorage.setItem('userToken', res.data.token)
          AsyncStorage.setItem('userData', JSON.stringify(res.data))

          axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`

          dispatch({ type: 'SIGN_IN', token: res.data.token })
        } catch (e) {
          showError(e)
        }
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async () => {

      },
      logged: async () => {
        const userDataJson = await AsyncStorage.getItem('userData')
        let userData = null

        try {
          userData = JSON.parse(userDataJson)
        } catch (e) {
          //UserData está inválido
        }

        if (userData && userData.token) {
          axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
        }

        dispatch({ type: 'LOGGED', token: userData.token })
      }
    }),
    []
  )

  if (state.isLoading) {
    return <Loading />
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken == null ? (
          <AuthStack.Navigator 
            screenOptions={{
              headerShown: false
            }} >
            <AuthStack.Screen name="Auth" component={Auth} />
          </AuthStack.Navigator>
        ) : (
            <HomeStack.Navigator 
              screenOptions={{
                headerShown: false
              }} >
              <HomeStack.Screen name="Home" component={TabsScreen} />
              <HomeStack.Screen name="WordsList" component={WordsList} />
              <HomeStack.Screen name="Speech" component={Speech} />
            </HomeStack.Navigator>
          )}
      </NavigationContainer>
    </AuthContext.Provider>
  )
}