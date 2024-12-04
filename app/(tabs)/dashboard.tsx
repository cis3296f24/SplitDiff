import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import jsonData from '../../assets/json/image0.json'; // Adjust the path as per your project structure
import { Ionicons } from '@expo/vector-icons';

import { Input, TextArea, XStack, YStack, Label, Button } from 'tamagui'

// components
import Item from '@/components/Item';
import AddEditModal from '@/components/AddModal';

// utils
import { analyzeImage, pickImage } from '@/utils/image';

type PersonaType = {
  id: string;
  name: string;
  selectedItems: number[];
};

type ItemType = {
  id: number,
  cost: number,
  name: string,
  quantity: number,
  subItems: string[],
  assignedPersonas?: string[];
}

export default function DashboardTab() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [items, setItems] = useState<ItemType[]>([]);

  const [personaName, setPersonaName] = useState<string>('');
  const [personas, setPersonas] = useState<PersonaType[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleAddPersona = () => {
    if (personaName.trim() !== '') {
      const newPersona: PersonaType = { 
        id: Math.random().toString(), 
        name: personaName.trim(),
        selectedItems: []
      };
      setPersonas([...personas, newPersona]);
      setPersonaName('');
    }
  };

  const handleRemovePersona = (id: string) => {
    // Remove persona from personas list
    const updatedPersonas = personas.filter(persona => persona.id !== id);
    setPersonas(updatedPersonas);

    // Remove this persona's selections from items
    const updatedItems = items.map(item => ({
      ...item,
      assignedPersonas: item.assignedPersonas?.filter(personaId => personaId !== id)
    }));
    setItems(updatedItems);
  };

  const toggleItemSelection = (itemId: number) => {
    if (!selectedPersona) {
      Alert.alert('Select a Persona', 'Please select a persona first before assigning items.');
      return;
    }

    // Find the current item
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        // If item already has assignedPersonas, toggle the current persona
        const currentPersonas = item.assignedPersonas || [];
        const updatedPersonas = currentPersonas.includes(selectedPersona.id)
          ? currentPersonas.filter(id => id !== selectedPersona.id)
          : [...currentPersonas, selectedPersona.id];

        return {
          ...item,
          assignedPersonas: updatedPersonas
        };
      }
      return item;
    });

    setItems(updatedItems);
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
    setItems([...items, { ...item, assignedPersonas: [] }]);
  };

  function parseText(data: any) {
    const with_quantity_regex = /^\s*(\d+)\s+(.*\S)\s+(\(?)([0-9.]+)\)?\s*$/;
    const no_quantity_regex = /(.*\S)\s+(\(?)([0-9.]+)\)?\s*$/;
    const remove_special_char_regex = /[!@#$%^&*]/g;

    const items: ItemType[] = [];
    let id = 0;
    for (const line of data.Items.valueArray) {
      let parsed_line = line.content.replace(/\n/g, ' ');
      parsed_line = parsed_line.replace(remove_special_char_regex, '');

      if (with_quantity_regex.test(parsed_line)) {
        const match = parsed_line.match(with_quantity_regex);
        if (!match)  return;

        const quantity = parseInt(match[1]);
        const name = match[2];
        const cost = parseFloat(match[4]);

        items.push({
          id: id++,
          cost: cost,
          name: name,
          quantity: quantity,
          subItems: ["fries", "chocolate cake"],
          assignedPersonas: []
        });
      }
      else if (no_quantity_regex.test(parsed_line)) {
        const match = parsed_line.match(no_quantity_regex);
        if (!match) return
        const quantity = 1;
        const name = match[1];
        const cost = parseFloat(match[3]);

        items.push({
          id: id++,
          cost: cost,
          name: name,
          quantity: quantity,
          subItems: [],
          assignedPersonas: []
        });
      }
      else {
        console.log('No match found for line:', parsed_line);
      }
    }
    return items;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <AddEditModal
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          onAddItem={addItem}
          items={items}/>

        {imageUri && (
          <Image
            source={{uri: imageUri}}
            style = {{width: 300, height: 300}}
          />
        )}
        <TouchableOpacity
          onPress={async () => {
            const res = await pickImage();
            if (res) {
              setImageUri(res);
            }
          }}
        >
          <Text>Choose an Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={ () => {
            analyzeImage(imageUri as string)
            .then((response) => {
              setItems(parseText(response));
            })
            ;
          }}
        >
          <Text>Extract info from Image</Text>
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
                  items.map((item: ItemType) => {
                    return (
                      <TouchableOpacity 
                        key={item.id} 
                        onPress={() => toggleItemSelection(item.id)}
                        style={[
                          styles.itemContainer,
                          // Optional: Add highlight for items assigned to selected persona
                          selectedPersona && item.assignedPersonas?.includes(selectedPersona.id) && 
                          { backgroundColor: '#e6f2ff' }
                        ]}
                      >
                        <Item 
                          key={item.id} 
                          data={item}
                          onDelete={removeItem}
                          onEdit={editItem} 
                        />
                        {/* Display assigned personas */}
                        {item.assignedPersonas && item.assignedPersonas.length > 0 && (
                          <View style={{ 
                            backgroundColor: '#f0f0f0', 
                            padding: 5, 
                            borderRadius: 5,
                            marginTop: 5 
                          }}>
                            <Text style={{ fontSize: 12, color: '#666' }}>
                              Assigned to: {item.assignedPersonas.map(id => 
                                personas.find(p => p.id === id)?.name
                              ).join(', ')}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
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

            <TouchableOpacity 
              style={styles.doneButton} 
              onPress={() => {
                // Optional: Implement split logic
                const splitDetails = items.map(item => ({
                  item: item.name,
                  assignedPersonas: item.assignedPersonas 
                    ? item.assignedPersonas.map(id => 
                        personas.find(p => p.id === id)?.name
                      )
                    : []
                }));
                
                alert(JSON.stringify(splitDetails, null, 2));
              }}
            >
              <Ionicons name="arrow-forward" size={17} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={personas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.personaItem,
                  selectedPersona?.id === item.id && { backgroundColor: '#e0e0e0' }
                ]}
                onPress={() => setSelectedPersona(item)}
              >
                <Text>{item.name}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemovePersona(item.id)}
                >
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.personaList}
          />
        </>
      )}
    </View>
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
  rightAction: { width: 50, height: 50, backgroundColor: 'purple' },
});