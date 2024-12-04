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

export { PersonaType, ItemType };