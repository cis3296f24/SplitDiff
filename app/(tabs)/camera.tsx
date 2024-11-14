import { View, Text, StyleSheet } from 'react-native';
import { useCameraPermission, useCameraDevice, Camera } from 'react-native-vision-camera';
import { useEffect } from 'react';

function NoCameraDeviceError() {
  return <Text>No Camera Device Error</Text>
}

function PermissionsPage() {
  return <Text>Camera Permission not given</Text>
}

export default function CameraTab() {

  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission();

  if (device == null) return <NoCameraDeviceError />

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

    // return () => {
    //   second
    // }
  }, [])


  return (
    <View style={styles.container}>
      <Text>Camera Tab</Text>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
