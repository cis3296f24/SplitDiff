type PersonaType = {
    id: string;
    name: string;
};

type ItemType = {
    id: number,
    cost: number,
    name: string,
    quantity: number,
    subItems: string[]
}

export { PersonaType, ItemType };