import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

import Auth from './screens/Auth'
import TaskList from './screens/TaskList'
import Notifications from './screens/Notifications'
import AuthOrApp from './screens/AuthOrApp'
import { showError, server } from './common'
import { AuthContext } from './Context'

const AuthStack = createStackNavigator()
const Tabs = createBottomTabNavigator()
const HomeStack = createStackNavigator()
const NotificationsStack = createStackNavigator()
const Drawer = createDrawerNavigator()

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={TaskList} />
  </HomeStack.Navigator>
)

const NotificationsStackScreen = () => (
  <NotificationsStack.Navigator>
    <NotificationsStack.Screen name="Notifications" component={Notifications} />
  </NotificationsStack.Navigator>
)

const TabsScreen = () => (
  <Tabs.Navigator>
    <Tabs.Screen name="Home" component={HomeStackScreen} />
    <Tabs.Screen name="Home" component={NotificationsStackScreen} />
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

          dispatch({ type: 'SIGN_IN', token: res.data.token })
        } catch (e) {
          showError(e)
        }
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async () => {

      },
    }),
    []
  )

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken == null ? (
          <AuthStack.Navigator>
            <AuthStack.Screen name="Auth" component={Auth} />
          </AuthStack.Navigator>
        ) : (
            <Tabs.Navigator>
              <Tabs.Screen name="Home" component={HomeStackScreen} />
              <Tabs.Screen name="Notifications" component={NotificationsStackScreen} />
            </Tabs.Navigator>
          )}
      </NavigationContainer>
    </AuthContext.Provider>
  )

  const userDataJson = AsyncStorage.getItem('userData')
  let userData = null

  try {
    userData = JSON.parse(userDataJson)
  } catch (e) {
    //UserData está inválido
  }

  return (
    <NavigationContainer>
      {userData && userData.token ?
        axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
          (
            <Tabs.Navigator>
              <Tabs.Screen name="Home" component={HomeStackScreen} />
              <Tabs.Screen name="Notifications" component={NotificationsStackScreen} />
            </Tabs.Navigator>
          ) : (
          <AuthStack.Navigator>
            <AuthStack.Screen name="Auth" component={Auth} />
          </AuthStack.Navigator>
        )
      }
    </NavigationContainer>
  )
}