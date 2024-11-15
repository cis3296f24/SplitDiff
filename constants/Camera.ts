import { Dimensions, Platform } from 'react-native'



// CAMERA SECTION

export const CONTENT_SPACING = 15

// The maximum zoom _factor_ you should be able to zoom in
export const MAX_ZOOM_FACTOR = 10

export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = Platform.select<number>({
  android: Dimensions.get('screen').height,
  ios: Dimensions.get('window').height,
}) as number

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78

// Control Button like Flash
export const CONTROL_BUTTON_SIZE = 40