import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'
import { analyzeImage } from '@/utils/image';
import { parse } from '@babel/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import jsonData from '../../assets/json/image0.json'; // Adjust the path as per your project structure
import { Ionicons } from '@expo/vector-icons';

type ItemType = {
  cost: number,
  name: string,
  quantity: number,
}

type PersonaType = {
  id: string;
  name: string;
};

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
    <View style={styles.itemContainer}>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Name:</Text>
        <Text style={styles.itemValue}>{label.name}</Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Quantity:</Text>
        <Text style={styles.itemValue}>{label.quantity}</Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>Cost:</Text>
        <Text style={styles.itemValue}>${label.cost.toFixed(2)}</Text>
      </View>
    </View>
  );
}



export default function DashboardTab() {

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [labels, setLabels] = useState(null);
  const [personaName, setPersonaName] = useState<string>('');
  const [personas, setPersonas] = useState<PersonaType[]>([]);

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

  const handleAddPersona = () => {
    if (personaName.trim() !== '') {
      setPersonas([...personas, { id: Math.random().toString(), name: personaName.trim() }]);
      setPersonaName('');
    }
  };

  const handleRemovePersona = (id: string) => {
    setPersonas(personas.filter(persona => persona.id !== id));
  };

  return (
    // <SafeAreaView>
    <View style={{ flex: 1 }}>
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


        <TouchableOpacity
        onPress={() => {
          // Load bundled JSON file for testing
          console.log(jsonData);
          setLabels(jsonData.analyzeResult.documents[0].fields);
        }}
      >
        <Text>Extract info from Bundled JSON</Text>
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
{/* Bottom bar for adding personas */}
{labels && (
        <>
          <View style={styles.bottomBar}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter persona name"
              value={personaName}
              onChangeText={setPersonaName}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddPersona}>
              <Text style={styles.addButtonText}>Add Persona</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.doneButton} onPress={() => alert('Done editing')}>
              <Ionicons name="arrow-forward" size={17} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={personas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.personaItem}>
                <Text>{item.name}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemovePersona(item.id)}
                >
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.personaList}
          />
        </>
      )}
    </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  itemLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  itemValue: {
    fontSize: 14,
    color: '#555',
  },
  scrollContainer: {
    padding: 20,
  },
  itemSubContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  personaList: {
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  personaItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  removeButton: {
    padding: 5,
    backgroundColor: 'transparent',
  },
  doneButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
});