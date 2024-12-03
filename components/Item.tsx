import { useState, useEffect } from 'react';
import { View, Text, StyleSheet,
  Image, TextInput, Pressable, Button } from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

// type


function Item({ data, onEdit, onDelete }) {

  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
        return {
          transform: [{ translateX: drag.value + 120 }],
        };
    });

    return (
        <Reanimated.View
        style={styleAnimation}
        key={data.id}>
          <View
          style={styles.rightActionContainer}>
              <Pressable
                onPress={() => onEdit(data.id, data)}
                style={styles.rightActionButtonContainer}
              >
                {/* <Text style={styles.rightActionEdit}>Edit</Text> */}
                <MaterialIcons name="edit" size={24} color="black" />


              </Pressable>

              <Pressable
                onPress={() => onDelete(data.id)}
                style={[styles.rightActionButtonContainer, {backgroundColor: '#FF3008'}]}
              >
                {/* <Text style={styles.rightActionDelete}>Delete</Text> */}
                <MaterialCommunityIcons name="trash-can-outline" size={24} color="white" />
              </Pressable>
          </View>
        </Reanimated.View>
    );
  }

  return (
    <ReanimatedSwipeable
        containerStyle={styles.itemContainer}
        friction={1.5}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={RightAction}

        >
        <View style={styles.itemRow}>
          <View>
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>{data.quantity} x</Text>
              <Text style={styles.itemLabel}>{data.name}</Text>
            </View>
            {/* Sub Item */}
            {  data.subItems.length > 0 && (
                  data.subItems.map((subItem : any) => {
                    return (
                      <Text style={styles.itemSubLabel}>
                        {subItem}
                      </Text>
                    )
                  })
              )
            }

          </View>
          <View style={{justifyContent: "center", alignContent: "center", flex: "1"}}>
            <Text style={styles.itemLabel}>{data.cost.toFixed(2)} $</Text>
          </View>
        </View>
      </ReanimatedSwipeable>
  );
}

export default Item;

const styles = StyleSheet.create({
  rightActionContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  rightActionButtonContainer: {

    height: '100%',
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',

    borderColor: '#858585',
    borderStyle: 'solid',
    borderLeftWidth: 1,

  },
  rightActionEdit: {
    width: 60,
    color: 'white',
  },
  rightActionDelete: {
    width: 60,
    color: 'white',
  },


  itemContainer: {
    backgroundColor: '#f8f9fa',
    // '#f8f9fa'
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',

    borderColor: '#d6d1d1',
    borderStyle: 'solid',
    borderWidth: 1,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    gap: 5,
  },
  itemLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  itemSubLabel: {
    fontSize: 14,
    color: '#555',
  },
  itemSubContainer: {
    flex: 1,
    alignItems: 'center',
  },
});