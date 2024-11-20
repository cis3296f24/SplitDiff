import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'

import { analyzeImage } from '@/utils/image';
import { parse } from '@babel/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

type ItemType = {
  cost: number,
  name: string,
  quantity: number,
}


function Item({data}: any) {

  const [label, setLabel] = useState<ItemType>({
    cost: 0,
    name: '',
    quantity: 0,
  });

  function parseText(data: any) {

    const with_quantity_regex = /^\s*(\d+)\s+(.*\S)\s+(\(?)\$([0-9.]+)\)?\s*$/;
    const no_quantity_regex = /(.*\S)\s+(\(?)\$([0-9.]+)\)?\s*$/;

    const lines = data.content.replace(/\n/g, ' ')

    if (with_quantity_regex.test(lines)) {
      const match = lines.match(with_quantity_regex);
      const quantity = parseInt(match[1]);
      const name = match[2];
      const cost = parseFloat(match[4]);

      setLabel({
        cost: cost,
        name: name,
        quantity: quantity,
      });
    }
    else if (no_quantity_regex.test(lines)) {
      const match = lines.match(no_quantity_regex);
      const quantity = 1;
      const name = match[1];
      const cost = parseFloat(match[3]);

      setLabel({
        cost: cost,
        name: name,
        quantity: quantity,
      });

    }



  }

  useEffect(() => {
    parseText(data);
  }, [])

  return (
    <View style={styles.item_container}>
      <View style={styles.item_sub_container}>
        <Text>
          {label.name}
        </Text>
      </View>

      <View style={styles.item_sub_container}>
        <Text>
          {label.quantity}
        </Text>
      </View>

      <View style={styles.item_sub_container}>
          <Text>
            {label.cost}
          </Text>
        </View>
    </View>
  );
}



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
    // <SafeAreaView>
      <ScrollView>
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
                {
                  labels.Items.valueArray.map((label: any) => {
                    return (
                      <Item data={label} />
                    )
                  })
                }

              </View>
          )

        }

      </ScrollView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_container: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  item_sub_container: {
    backgroundColor: 'grey',
    borderRadius: 10,
    padding: 10,
  }


});