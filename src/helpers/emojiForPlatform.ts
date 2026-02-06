import { Platform } from "react-native";

export const emojiForPlatform = () => {
    if (Platform.OS === 'ios') {
        return '🍎';
    } else {
        return '🤖';
    }
};