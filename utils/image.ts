import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker';
import DocumentIntelligence, {getLongRunningPoller, isUnexpected, AnalyzeResultOperationOutput} from "@azure-rest/ai-document-intelligence";


const apiKey = 'b88f5cb59eb84018b0c68dfa58f78cc0';
const endpoint = 'https://eastus.api.cognitive.microsoft.com/';

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


    console.log("Initial response:", initialResponse.body);
    if (isUnexpected(initialResponse)) {
        throw initialResponse.body.error;
    }

    const poller = await getLongRunningPoller(client, initialResponse);
    const result = (
        (await (poller).pollUntilDone()).body as AnalyzeResultOperationOutput
    ).analyzeResult;
    const documents = result?.documents;
    const document = documents && documents[0];

        console.log("Document fields:", document);

    // Use of PrebuiltModels.Receipt above (rather than the raw model ID), as it adds strong typing of the model's output
    if (document) {
        console.log("Document fields:", document);
        return document.fields;
    } else {
        throw new Error("Expected at least one receipt in the result.");
    }


};

export { analyzeImage, pickImage };