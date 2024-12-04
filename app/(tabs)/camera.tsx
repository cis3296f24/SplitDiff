import * as React from 'react'
import { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { useCameraPermission, useCameraDevice, Camera, useCameraFormat } from 'react-native-vision-camera';
import Reanimated, { Extrapolation, interpolate, useAnimatedGestureHandler, useAnimatedProps, useSharedValue } from 'react-native-reanimated'
import { PinchGestureHandler } from 'react-native-gesture-handler';
import { PressableOpacity } from 'react-native-pressable-opacity'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcon from 'react-native-vector-icons/Ionicons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { Link, useNavigation } from 'expo-router';

//components
import { CaptureButton } from '@/components/CaptureButton';

// utils
import { pickImage } from '@/utils/image';

//types
import type { CameraProps, CameraRuntimeError, PhotoFile } from 'react-native-vision-camera'
import type { GestureResponderEvent } from 'react-native'
import type { PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import type { NativeStackScreenProps } from 'react-native-screens/native-stack';

// constants
import { SAFE_AREA_PADDING, CONTENT_SPACING, CONTROL_BUTTON_SIZE, MAX_ZOOM_FACTOR, SCREEN_HEIGHT, SCREEN_WIDTH } from '@/constants/Camera'

function NoCameraDeviceError() {
  return <Text>No Camera Device Error</Text>
}

function PermissionsPage() {
  return <Text>Camera Permission not given</Text>
}


const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)
Reanimated.addWhitelistedNativeProps({
  zoom: true,
})

const SCALE_FULL_ZOOM = 3

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

type Props = NativeStackScreenProps<Routes, 'CameraPage'>
export default function CameraPage(): React.ReactElement {

  const camera = useRef<Camera>(null);
  const navigation = useNavigation<any>();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const zoom = useSharedValue(1)
  const isPressingButton = useSharedValue(false)

  const [enableHdr, setEnableHdr] = useState(false)
  const [flash, setFlash] = useState<'off' | 'on'>('off')
  const [enableNightMode, setEnableNightMode] = useState(false)

  // camera device settings
  const device = useCameraDevice('back', {
    physicalDevices: [
    'ultra-wide-angle-camera',
    'wide-angle-camera',
    'telephoto-camera'
  ]
  })

  const [targetFps, setTargetFps] = useState(60)

  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH
  const format = useCameraFormat(device, [
    { fps: targetFps },
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: 'max' },
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: 'max' },
  ])

  const fps = Math.min(format?.maxFps ?? 1, targetFps)

  const supportsFlash = device?.hasFlash ?? false
  const supportsHdr = format?.supportsPhotoHdr
  const supports60Fps = useMemo(() => device?.formats.some((f) => f.maxFps >= 60), [device?.formats])
  const canToggleNightMode = device?.supportsLowLightBoost ?? false

  //#region Animated Zoom
  const minZoom = device?.minZoom ?? 1
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR)

  const cameraAnimatedProps = useAnimatedProps<CameraProps>(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom)
    return {
      zoom: z,
    }
  }, [maxZoom, minZoom, zoom])

  // Callbacks
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton
    },
    [isPressingButton],
  )
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error)
  }, [])
  const onInitialized = useCallback(() => {
    console.log('Camera initialized!')
    setIsCameraInitialized(true)
  }, [])
  const onMediaCaptured = useCallback(
    (media_uri: string, type: 'photo') => {
      console.log(`Media captured! ${JSON.stringify(media_uri)}`)
      navigation.navigate('media', {
          path: media_uri,
          type: type,
      })
    },
    [navigation])

  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === 'off' ? 'on' : 'off'))
  }, [])

  // Tap Gestures
  const onFocusTap = useCallback(
    ({ nativeEvent: event }: GestureResponderEvent) => {
      if (!device?.supportsFocus) return
      camera.current?.focus({
        x: event.locationX,
        y: event.locationY,
      })
    },
    [device?.supportsFocus],
  )

  // Pinch to Zoom Gesture
  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  // const onPinchGesture = Gesture.Pinch()
  //   .onStart((_, context): void  => {
  //     context.startZoom = zoom.value
  //   })
  //   .onUpdate((event: any, context: any) => {
  //     //  we're trying to map the scale gesture to a linear zoom here
  //     const startZoom = context.startZoom ?? 0
  //     const scale = interpolate(event.scale, [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM], [-1, 0, 1], Extrapolate.CLAMP)
  //     zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP)
  //   })
  const onPinchGesture = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, { startZoom?: number }>({
    onStart: (_, context) => {
      context.startZoom = zoom.value
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0
      const scale = interpolate(event.scale, [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM], [-1, 0, 1], Extrapolation.CLAMP)
      zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolation.CLAMP)
    },
  })

  const videoHdr = format?.supportsVideoHdr && enableHdr
  const photoHdr = format?.supportsPhotoHdr && enableHdr && !videoHdr

  if (device == null) return <NoCameraDeviceError />

  useEffect(() => {
      // Reset zoom to it's default everytime the `device` changes.
      zoom.value = device?.neutralZoom ?? 1
    }, [zoom, device])

  useEffect(() => {
    const f =
      format != null
        ? `(${format.photoWidth}x${format.photoHeight} photo / ${format.videoWidth}x${format.videoHeight}@${format.maxFps} video @ ${fps}fps)`
        : undefined
    console.log(`Camera: ${device?.name} | Format: ${f}`)
  }, [device?.name, format, fps])

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then((permission) => {
        if (permission) {
          console.log('Permission granted')
        } else {
          console.log('Permission denied')
          return <PermissionsPage />
        }
      });
    }
  }, [])


  return (
    <View style={styles.container}>
      { device != null ? (
        <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={true}>
          <Reanimated.View onTouchEnd={onFocusTap} style={StyleSheet.absoluteFill}>
            <ReanimatedCamera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              ref={camera}
              onInitialized={onInitialized}
              onError={onError}
              onStarted={() => console.log('Camera started!')}
              onStopped={() => console.log('Camera stopped!')}
              onPreviewStarted={() => console.log('Preview started!')}
              onPreviewStopped={() => console.log('Preview stopped!')}
              onOutputOrientationChanged={(o) => console.log(`Output orientation changed to ${o}!`)}
              onPreviewOrientationChanged={(o) => console.log(`Preview orientation changed to ${o}!`)}
              onUIRotationChanged={(degrees) => console.log(`UI Rotation changed: ${degrees}°`)}
              format={format}
              fps={fps}
              photoHdr={photoHdr}
              videoHdr={videoHdr}
              photoQualityBalance="quality"
              lowLightBoost={device.supportsLowLightBoost && enableNightMode}
              enableZoomGesture={false}
              animatedProps={cameraAnimatedProps}
              exposure={0}
              outputOrientation="device"
              photo={true}
              video={true}
            />
          </Reanimated.View>
        </PinchGestureHandler>
      ) : (
        <Text>Your phone does not have a Camera.</Text>
      )}

        <CaptureButton
          style={styles.captureButton}
          camera={camera}
          onMediaCaptured={onMediaCaptured}
          cameraZoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          flash={supportsFlash ? flash : 'off'}
          enabled={isCameraInitialized}
          setIsPressingButton={setIsPressingButton}
        />

        <PressableOpacity
        onPress={async () => {
          let res = await pickImage();
          if (res) {
            res = res.replace('file://', '');
            onMediaCaptured(res, 'photo');
          }
        }}
        style={styles.button} >
            <MaterialIcon name='photo-library' color="white" size={30} />
        </PressableOpacity>

      <View style={styles.rightButtonRow}>
        {supportsFlash && (
          <PressableOpacity style={styles.button} onPress={onFlashPressed} disabledOpacity={0.4}>
            <IonIcon name={flash === 'on' ? 'flash' : 'flash-off'} color="white" size={24} />
          </PressableOpacity>
        )}
        {supports60Fps && (
          <PressableOpacity style={styles.button} onPress={() => setTargetFps((t) => (t === 30 ? 60 : 30))}>
            <Text style={styles.text}>{`${targetFps}\nFPS`}</Text>
          </PressableOpacity>
        )}
        {supportsHdr && (
          <PressableOpacity style={styles.button} onPress={() => setEnableHdr((h) => !h)}>
            <MaterialCommunityIcon name={enableHdr ? 'hdr' : 'hdr-off'} color="white" size={24} />
          </PressableOpacity>
        )}
        {canToggleNightMode && (
          <PressableOpacity style={styles.button} onPress={() => setEnableNightMode(!enableNightMode)} disabledOpacity={0.4}>
            <IonIcon name={enableNightMode ? 'moon' : 'moon-outline'} color="white" size={24} />
          </PressableOpacity>
        )}
        <PressableOpacity style={styles.button} >
          <Link href="/media">
            <IonIcon name="settings-outline" color="white" size={24} />
          </Link>
        </PressableOpacity>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: SAFE_AREA_PADDING.paddingBottom,
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  text: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})