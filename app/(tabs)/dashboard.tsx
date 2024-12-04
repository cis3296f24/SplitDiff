import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
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
import { ItemType, PersonaType, SplitResult } from '@/constants/types';

export default function DashboardTab() {
  const navigation = useNavigation<any>();

  const [items, setItems] = useState<ItemType[]>([]);
  const [personaName, setPersonaName] = useState<string>('');
  const [personas, setPersonas] = useState<PersonaType[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [splitResults, setSplitResults] = useState<SplitResult[]>([]);

  useEffect(() => {
    // Calculate split results whenever items or personas change
    if (items.length > 0 && personas.length > 0) {
      const results = calculateSplitBill(items, personas);
      setSplitResults(results);
    }
  }, [items, personas]);

  const calculateSplitBill = (items: ItemType[], personas: PersonaType[]): SplitResult[] => {
    // Initialize bill split results
    const billSplit: { [key: string]: number } = {};

    // Initialize bill split with zero for each persona
    personas.forEach(persona => {
      billSplit[persona.name] = 0;
    });

    // Calculate each person's share
    items.forEach(item => {
      // Ensure price is a valid number and personas are assigned
      const itemPrice = item.cost; // Changed from 'price' to 'cost' based on your types
      
      // Only split if personas are assigned
      if (item.assignedPersonas && item.assignedPersonas.length > 0) {
        // Calculate split price for this item
        const splitPrice = itemPrice / item.assignedPersonas.length;

        // Add split price to each assigned persona
        item.assignedPersonas.forEach(personaId => {
          const persona = personas.find(p => p.id === personaId);
          if (persona) {
            billSplit[persona.name] += splitPrice;
          }
        });
      }
    });

    // Convert to SplitResult array and round to 2 decimal places
    return Object.keys(billSplit).map(name => ({
      name,
      amount: Number(billSplit[name].toFixed(2))
    }));
  };

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

  const getAssignedPersonaNames = (item: ItemType) => {
    if (!item.assignedPersonas || item.assignedPersonas.length === 0) return 'No one selected';
    return item.assignedPersonas
      .map(personaId => personas.find(p => p.id === personaId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const splitBill = () => {
    // Detailed validation with comprehensive error reporting
    if (personas.length === 0) {
      Alert.alert('Error', 'Please add at least one persona.');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Please add at least one item.');
      return;
    }

    // Detailed item validation
    const problemItems = items.filter(item => {
      // Check for invalid or missing price
      const invalidPrice = 
        item.cost === undefined || 
        item.cost === null || 
        item.cost === 0 || 
        isNaN(Number(item.cost));

      // Check for no assigned personas
      const noPersonasAssigned = 
        !item.assignedPersonas || 
        item.assignedPersonas.length === 0;

      return invalidPrice || noPersonasAssigned;
    });

    // If there are problematic items, provide detailed error
    if (problemItems.length > 0) {
      const errorDetails = problemItems.map(item => {
        const priceStatus = item.cost === undefined ? 'No price' : 
                            item.cost === null ? 'Null price' : 
                            item.cost === 0 ? 'Zero price' : 
                            isNaN(Number(item.cost)) ? 'Invalid price' : 'Valid price';
        
        const personaStatus = !item.assignedPersonas ? 'No personas array' :
                               item.assignedPersonas.length === 0 ? 'No personas assigned' : 'Personas assigned';
        
        return `Item: ${item.name || 'Unnamed'} (Price: ${priceStatus}, Personas: ${personaStatus})`;
      }).join('\n');

      Alert.alert(
        'Bill Splitting Error', 
        'Some items are missing price or persona assignments:\n\n' + errorDetails
      );
      return;
    }

    // Navigate to bill split results screen
    navigation.navigate('billsplit', { splitResults });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <AddEditModal
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          onAddItem={addItem}
          items={items}
        />

        <TouchableOpacity onPress={async () => {
          const res = await pickImage();
          if (res) {
            navigation.navigate('media', {
              path: res,
              type: "photo",
            })
          }
        }}>
          <Text>Choose an Image</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          // Load bundled JSON file for testing
          setItems(parseText(jsonData.analyzeResult.documents[0].fields));
        }}>
          <Text>Extract info from Bundled JSON</Text>
        </TouchableOpacity>

        {items && (
          <View>
            <Text>Info:</Text>
            {items.map((item: ItemType) => (
              <View key={item.id}>
                <TouchableOpacity 
                  onPress={() => toggleItemSelection(item.id)}
                  style={selectedPersona ? styles.selectableItem : {}}
                >
                  <Item 
                    data={item}
                    onDelete={removeItem}
                    onEdit={editItem} 
                  />
                </TouchableOpacity>
                <Text style={styles.assignedPersonasText}>
                  Assigned to: {getAssignedPersonaNames(item)}
                </Text>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bill Split Results */}
        {splitResults.length > 0 && (
          <View style={styles.container}>
            <Text style={styles.header}>Split Bill Results</Text>
            <FlatList
              data={splitResults}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.resultRow}>
                  <Text style={styles.personaName}>{item.name}</Text>
                  <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
                </View>
              )}
            />
          </View>
        )}
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
              onPress={splitBill}
            >
              <Text style={styles.doneButtonText}>Split Bill</Text>
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
  doneButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    marginRight: 5,
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  personaName: {
    fontSize: 18,
    color: '#555',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  rightAction: {
    width: 50,
    height: 50,
    backgroundColor: 'purple'
  },
});