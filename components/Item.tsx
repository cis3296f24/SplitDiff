import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

// type
import type { DocumentFieldOutput } from '@azure-rest/ai-document-intelligence';

// type ResponseData extends AnalyzeResultOutput {
//   id: string;
// }


type ItemType = {
  cost: number,
  name: string,
  quantity: number,
}




function Item({ data, onEdit, onDelete }) {

  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
        console.log('[R] showRightProgress:', prog.value);
        console.log('[R] appliedTranslation:', drag.value);

        return {
        transform: [{ translateX: drag.value + 50 }],
        };
    });

    return (
        <Reanimated.View
        style={styleAnimation}>
          <View
          className='flex justify-center'>
              <TouchableOpacity
                onPress={() => onEdit(data.id, data)}
              >
                <Text>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onDelete(data.id)}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
          </View>
        </Reanimated.View>
    );
  }

  return (
    <ReanimatedSwipeable
        containerStyle={styles.itemContainer}
        friction={2.5}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={RightAction}
        overshootRight>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Name:</Text>
          <Text style={styles.itemValue}>{data.name}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Quantity:</Text>
          <Text style={styles.itemValue}>{data.quantity}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemLabel}>Cost:</Text>
          <Text style={styles.itemValue}>${data.cost.toFixed(2)}</Text>
        </View>
      </ReanimatedSwipeable>
  );
}

export default Item;

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
  itemSubContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightAction: { width: 50, height: 50, backgroundColor: 'purple' },
});