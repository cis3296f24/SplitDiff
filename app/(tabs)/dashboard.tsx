import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import jsonData from '../../assets/json/image0.json'; // Adjust the path as per your project structure
import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from 'expo-router'

// components
import Item from '@/components/Item';
import AddEditModal from '@/components/AddModal';

// utils
import { pickImage, parseText } from '@/utils/image';

// types
import { ItemType, PersonaType } from '@/constants/types';

export default function DashboardTab() {

  const navigation = useNavigation<any>();

  const [items, setItems] = useState<ItemType[]>();

  const [personaName, setPersonaName] = useState<string>('');
  const [personas, setPersonas] = useState<PersonaType[]>([]);

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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

  const editItem = (itemId: number, newValue) => {
    console.log('Editing item');
  };

  const removeItem = (itemId: number) => {
    if (!items) return;
    setItems(items.filter((item) => item.id != itemId));
  };
  const addItem = (item: ItemType) => {
    if (!items) return;
    setItems([...items, item]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>

        <AddEditModal
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          onAddItem={addItem}
          items={items}/>

        <TouchableOpacity
          onPress={async () => {
            const res = await pickImage();

            if (res) {
              navigation.navigate('media', {
                  path: res,
                  type: "photo",
              })
            }
          }}
        >
          <Text>Choose an Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
        onPress={() => {
          // Load bundled JSON file for testing
          setItems(parseText(jsonData.analyzeResult.documents[0].fields));
        }}
      >
        <Text>Extract info from Bundled JSON</Text>
      </TouchableOpacity>

      {
        items && (
            <View>
              <Text>
                Info:
              </Text>
              {
                items.map((item: any) => {
                  return (
                    <Item key={item.ind} data={item}
                    onDelete={removeItem}
                    onEdit={editItem} />
                  )
                })
              }

            <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>

            </View>
        )
      }

      </ScrollView>
{/* Bottom bar for adding personas */}
    {items && (
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
    </SafeAreaView>
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
  rightAction: {
    width: 50,
    height: 50,
    backgroundColor: 'purple'
  },
});