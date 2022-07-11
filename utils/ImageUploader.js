// CODE ADDED BY UDDIPAN
import storage from '@react-native-firebase/storage';
import { Platform } from "react-native";

const ImageUploader = async (uri) => {
    return new Promise(async (resolve, reject) => {
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        try {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                };
                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send(null);
            });
            const ref = storage()
                .ref()
                .child("Chats/" + filename);
            let snapshot = await ref.put(blob);
            const url = await storage().ref("Chats/" + filename).getDownloadURL();
            resolve(url);
        } catch (e) {
            reject(e);
        }
    })
};
export default ImageUploader;
// CODE ADDED BY UDDIPAN