import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker';
import DocumentIntelligence, {getLongRunningPoller, isUnexpected, AnalyzeResultOperationOutput} from "@azure-rest/ai-document-intelligence";
import { ItemType } from '@/constants/types';

const apiKey = 'b88f5cb59eb84018b0c68dfa58f78cc0';
const endpoint = 'https://eastus.api.cognitive.microsoft.com/';


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
            subItems: ["fries", "chocolate cake"]
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
            subItems: []
        });
    }
    else {
        console.log('No match found for line:', parsed_line);
    }
    }
    return items;
}

async function pickImage() {
    try {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            return result.assets[0].uri;
        }
    } catch (error) {
        console.error('Error picking image:', error);
    }
};


async function analyzeImage(imageUri: string) {
    if (!imageUri) {
        alert('Please select an image first.');
        return;
    }

    const client = new (DocumentIntelligence as any)(endpoint, { key: apiKey });

    // Read the image file from local URI and convert it to base64
    const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
    });

    const initialResponse = await client.path("/documentModels/{modelId}:analyze", "prebuilt-receipt")
    .post({
        contentType: "application/json",
        body: {
            base64Source: base64ImageData,
        },
        queryParameters: { locale: "en-IN" },
    });

    if (isUnexpected(initialResponse)) {
        throw initialResponse.body.error;
    }

    const poller = await getLongRunningPoller(client, initialResponse);
    const result = (
        (await (poller).pollUntilDone()).body as AnalyzeResultOperationOutput
    ).analyzeResult;
    const documents = result?.documents;
    const document = documents && documents[0];

    // Use of PrebuiltModels.Receipt above (rather than the raw model ID), as it adds strong typing of the model's output
    if (document) {
        return document.fields;
    } else {
        throw new Error("Expected at least one receipt in the result.");
    }

};

export { analyzeImage, pickImage, parseText };