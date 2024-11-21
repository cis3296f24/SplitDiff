import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'
import DocumentIntelligence, {getLongRunningPoller, isUnexpected, AnalyzeResultOperationOutput} from "@azure-rest/ai-document-intelligence";

// async function analyzeImage(imageUri: string) {
//     try {
//         if (!imageUri) {
//             alert('Please select an image first.');
//             return;
//         }

//         const apiKey = 'AIzaSyBf5T0gy_0fB-Te8MoA4ARfOBRr3UfQmzs';
//         const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

//         // Read the image file from local URI and convert it to base64
//         const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
//             encoding: FileSystem.EncodingType.Base64,
//         });

//         const requestData = {
//             requests: [
//                 {
//                     image: {
//                         content: base64ImageData,
//                     },
//                     features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
//                 },
//             ],
//         };

//         const apiResponse = await axios.post(apiUrl, requestData);
//         return apiResponse.data.responses[0]
//     } catch (error) {
//         console.error('Error analyzing image:', error);
//         alert('Error analyzing image. Please try again later.');
//     }
// };

async function analyzeImage(imageUri: string) {
    if (!imageUri) {
        alert('Please select an image first.');
        return;
    }

    const apiKey = 'b88f5cb59eb84018b0c68dfa58f78cc0';
    const endpoint = 'https://eastus.api.cognitive.microsoft.com/';
    // const apiUrl = `${endpoint}/documentintelligence/documentModels/prebuilt-receipt:analyze?_overload=analyzeDocument&api-version=2024-07-31-preview`;

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

export { analyzeImage };