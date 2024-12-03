import React, { useEffect, useMemo, useState } from 'react'
import { View, StyleSheet, Text, Image, SafeAreaView, Alert, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { ScrollView, SizableText, Input } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import { FlatList } from 'react-native-gesture-handler';
import { PressableOpacity } from 'react-native-pressable-opacity'

// components
import Item from '@/components/Item';
import AddEditModal from '@/components/AddModal';

// utils
import { analyzeImage, parseText} from '@/utils/image'

// types
import { ItemType, PersonaType } from '@/constants/types'

//constants
import { SAFE_AREA_PADDING } from '@/constants/Camera'


export default function SummaryPage(): React.ReactElement {

    const { path, type } = useLocalSearchParams();
    const navigation = useNavigation<any>();

    const [items, setItems] = useState<ItemType[]>();
    const [isModalVisible, setModalVisible] = useState(false);

    const [personaName, setPersonaName] = useState<string>('');
    const [personas, setPersonas] = useState<PersonaType[]>([]);

    const handleAddPersona = () => {
        if (personaName.trim() !== '') {
        setPersonas([...personas, { id: Math.random().toString(), name: personaName.trim() }]);
        setPersonaName('');
        }
    };

    const handleRemovePersona = (id: string) => {
        setPersonas(personas.filter(persona => persona.id !== id));
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const source = useMemo(() => ({ uri: `file://${path}` }), [path])

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

    useEffect(() => {
        if (path == null) {
            Alert.alert('No media path!', 'No media path was provided to MediaPage.')
            navigation.goBack()
        }
        analyzeImage(path as string).then((res) => {
            // TODO CHECK if RES is empty object
            console.log("done analyzing", res)
            setItems(parseText(res));
        });

    }, [source])

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center"}}>
            <PressableOpacity style={styles.closeButton} onPress={() => {navigation.goBack()}}>
                <Ionicons name="close" size={35} color="white" style={styles.icon} />
            </PressableOpacity>

            <ScrollView>
                <AddEditModal
                    isModalVisible={isModalVisible}
                    toggleModal={toggleModal}
                    onAddItem={addItem}
                    items={items}/>

                <View style={styles.container}>
                    {type === 'photo' && (
                        <Image
                            source={source}
                            style={{ width: 300, height: 300 }}
                            resizeMode="cover"
                        />
                    )}
                </View>

                <SizableText fontSize={20} fontWeight={900} color="black" >
                    Summary
                </SizableText>

                {
                    items && (
                        <View>
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

            {items && (
                <>
                    <View style={styles.bottomBar}>
                        <Input
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
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
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

    closeButton: {
        position: 'absolute',
        top: SAFE_AREA_PADDING.paddingTop,
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


    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 0,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
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
    personaList: {
        padding: 10,
    },
    personaItem: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})