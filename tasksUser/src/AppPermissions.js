import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'
import { Platform } from 'react-native'

const PLATFORM_MICROPHONE_PERMISSIONS = {
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO
}

const REQUEST_PERMISSION_TYPE = {
    microphone: PLATFORM_MICROPHONE_PERMISSIONS
}

const PERMISSION_TYPE = {
    microphone: 'microphone'
}

class AppPermissions {

    checkPermission = async (type): Promise<boolean> => {
        const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS]
        if(!permissions) {
            return true
        }
        try{    
            const result = await check(permissions)
            if(result === RESULTS.GRANTED) return true
            return this.requestPermission(permissions)
        } catch(error) {
            return false
        }
    }

    requestPermission = async (permissions): Promise<boolean> => {
        try {
            const result = await request(permissions)
            return result === RESULTS.GRANTED
        } catch(error) {
            return false
        }
    }
}

const Permission = new AppPermissions()
export { Permission, PERMISSION_TYPE }