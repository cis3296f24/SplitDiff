import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'

import { analyzeImage } from '@/utils/image';

export default function DashboardTab() {

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [labels, setLabels] = useState(null);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
      {imageUri && (
        <Image
          source={{uri: imageUri}}
          style = {{width: 300, height: 300}}
        />
      )}
      <TouchableOpacity
        onPress={pickImage}
      >
        <Text>Choose an Image</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={ () => {
          analyzeImage(imageUri as string)
          .then((response) => {
            setLabels(response);
          });

        }}
      >
        <Text>Extract info from Image</Text>
      </TouchableOpacity>

      {
        labels && (
            <View>
              <Text>
                Info:
              </Text>
              <Text>
                {labels.fullTextAnnotation.text}
              </Text>
            </View>
        )

      }

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
