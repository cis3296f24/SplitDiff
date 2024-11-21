import React, { useCallback, useMemo, useState } from 'react'
import type { ImageLoadEventData, NativeSyntheticEvent } from 'react-native'
import { StyleSheet, View, ActivityIndicator, PermissionsAndroid, Platform, Image } from 'react-native'
import type { OnVideoErrorData, OnLoadData } from 'react-native-video'
import { SAFE_AREA_PADDING } from '@/constants/Camera'
import { PressableOpacity } from 'react-native-pressable-opacity'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { Alert } from 'react-native'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import { useIsFocused } from '@react-navigation/core'

const requestSavePermission = async (): Promise<boolean> => {
    // On Android 13 and above, scoped storage is used instead and no permission is needed
    if (Platform.OS !== 'android' || Platform.Version >= 33) return true

    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    if (permission == null) return false
    let hasPermission = await PermissionsAndroid.check(permission)
    if (!hasPermission) {
        const permissionRequestResult = await PermissionsAndroid.request(permission)
        hasPermission = permissionRequestResult === 'granted'
    }
    return hasPermission
}

type OnLoadImage = NativeSyntheticEvent<ImageLoadEventData>

type Routes = {
    PermissionsPage: undefined
    CameraPage: undefined
    CodeScannerPage: undefined
    MediaPage: {
        path: string
        type: 'photo'
    }
    Devices: undefined
}


type Props = NativeStackScreenProps<Routes, 'MediaPage'>
export default function MediaPage({ navigation, route }: Props): React.ReactElement {
    const { path, type } = route.params
    const [hasMediaLoaded, setHasMediaLoaded] = useState(false)

    const [savingState, setSavingState] = useState<'none' | 'saving' | 'saved'>('none')

    const onMediaLoad = useCallback((event: OnLoadData | OnLoadImage) => {
        const source = event.nativeEvent.source
        console.log(`Image loaded. Size: ${source.width}x${source.height}`)
    }, [])
    const onMediaLoadEnd = useCallback(() => {
        console.log('media has loaded.')
        setHasMediaLoaded(true)
    }, [])

    const onSavePressed = useCallback(async () => {
        try {
            setSavingState('saving')

            const hasPermission = await requestSavePermission()
            if (!hasPermission) {
                Alert.alert('Permission denied!', 'Vision Camera does not have permission to save the media to your camera roll.')
                return
            }
            await CameraRoll.saveAsset(`file://${path}`, {
                type: type,
            })
            setSavingState('saved')
        } catch (e) {
            const message = e instanceof Error ? e.message : JSON.stringify(e)
            setSavingState('none')
            Alert.alert('Failed to save!', `An unexpected error occured while trying to save your ${type}. ${message}`)
        }
    }, [path, type])

    const source = useMemo(() => ({ uri: `file://${path}` }), [path])

    const screenStyle = useMemo(() => ({ opacity: hasMediaLoaded ? 1 : 0 }), [hasMediaLoaded])

    return (
        <View style={[styles.container, screenStyle]}>
        {type === 'photo' && (
            <Image source={source} style={StyleSheet.absoluteFill} resizeMode="cover" onLoadEnd={onMediaLoadEnd} onLoad={onMediaLoad} />
        )}

        <PressableOpacity style={styles.closeButton} onPress={navigation.goBack}>
        <IonIcon name="close" size={35} color="white" style={styles.icon} />
        </PressableOpacity>

        <PressableOpacity style={styles.saveButton} onPress={onSavePressed} disabled={savingState !== 'none'}>
        {savingState === 'none' && <IonIcon name="download" size={35} color="white" style={styles.icon} />}
        {savingState === 'saved' && <IonIcon name="checkmark" size={35} color="white" style={styles.icon} />}
        {savingState === 'saving' && <ActivityIndicator color="white" />}
        </PressableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    closeButton: {
        position: 'absolute',
        top: SAFE_AREA_PADDING.paddingTop,
        left: SAFE_AREA_PADDING.paddingLeft,
        width: 40,
        height: 40,
    },
    saveButton: {
        position: 'absolute',
        bottom: SAFE_AREA_PADDING.paddingBottom,
        left: SAFE_AREA_PADDING.paddingLeft,
        width: 40,
        height: 40,
    },
    icon: {
        textShadowColor: 'black',
        textShadowOffset: {
            height: 0,
            width: 0,
        },
        textShadowRadius: 1,
    },
})