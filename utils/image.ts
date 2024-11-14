import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'

async function analyzeImage(imageUri: string) {
    try {
        if (!imageUri) {
            alert('Please select an image first.');
            return;
        }

        const apiKey = 'AIzaSyBf5T0gy_0fB-Te8MoA4ARfOBRr3UfQmzs';
        const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

        // Read the image file from local URI and convert it to base64
        const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const requestData = {
            requests: [
                {
                    image: {
                        content: base64ImageData,
                    },
                    features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
                },
            ],
        };

        const apiResponse = await axios.post(apiUrl, requestData);
        return apiResponse.data.responses[0]
    } catch (error) {
        console.error('Error analyzing image:', error);
        alert('Error analyzing image. Please try again later.');
    }
};

export { analyzeImage };