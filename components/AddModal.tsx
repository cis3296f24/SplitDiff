import React from 'react';
import Modal from "react-native-modal";
import { View, Text } from 'react-native';
import { Input, XStack, YStack, Label, Button } from 'tamagui'
import { useForm, Controller } from "react-hook-form";

export default function AddModal({ isModalVisible, toggleModal, onAddItem }) {

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
        name: '',
        price: 0,
        quantity: 0
        }
    });

    const onInvalid = (errors: any) => console.error(errors)

    const handleModalSubmit = (data: any) => {
        const newItem = {
        id: items!.length + 1,
        name: data.name,
        cost: data.price,
        quantity: data.quantity,
        subItems: []
        }
        onAddItem(newItem);
        toggleModal();
    }
    return (
        <Modal isVisible={isModalVisible}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <YStack
                padding="$5"
                backgroundColor="white"
                borderRadius="$4"
                minWidth={300}
                gap="$4">
                    <XStack alignItems="center" gap="$4">
                        <Label width={90} htmlFor="name">
                            Item
                        </Label>
                        <Controller
                        control={control}
                        rules={{
                            required: { value: true, message: "Required" },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input flex={1}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value} />
                        )}
                        name="name"
                        />
                    </XStack>
                    {errors.name && <Text>{errors.name.message}</Text>}

                    <XStack alignItems="center" gap="$4">
                        <Label width={90} htmlFor="name">
                            Price
                        </Label>
                        <Controller
                        control={control}
                        rules={{
                            required: { value: true, message: "Required" },
                            // validate: (value) => value > 0,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input flex={1}
                            onBlur={onBlur}
                            onChangeText={value => onChange(+value)}
                            value={value}
                            type = 'number'
                            keyboardType='decimal-pad' inputMode='decimal'/>
                        )}
                        name="price"
                        />
                    </XStack>
                    {errors.price && <Text>{errors.price.message}</Text>}

                    <XStack alignItems="center" gap="$4">
                        <Label width={90} htmlFor="name">
                            Quantity
                        </Label>
                        <Controller
                        control={control}
                        rules={{
                            required: { value: true, message: "Required" },
                            maxLength: { value: 12, message: "Max Length" },
                            // validate: (value) => value > 0,
                        }}
                        render={({ field: {onChange, onBlur, value} }) => (
                            <Input flex={1}
                            onBlur={onBlur}
                            onChangeText={value => onChange(+value)}
                            value={value}
                            type = 'number'
                            keyboardType='numeric' inputMode='numeric'/>
                        )}
                        name="quantity"
                        />
                    </XStack>
                    {errors.quantity && <Text>{errors.quantity.message}</Text>}

                    <XStack alignItems="center" justifyContent='center' gap="$4">
                        <Button size="$3"
                        variant="outlined"
                        onPress={toggleModal}>
                            Cancel
                        </Button>
                        <Button
                        size="$3"
                        theme="active"
                        onPress={handleSubmit(handleModalSubmit, onInvalid)}>
                            Add Item
                        </Button>
                    </XStack>
                </YStack>
            </View>
        </Modal>
    )
}
