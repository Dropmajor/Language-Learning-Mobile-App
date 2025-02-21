/**
 * @fileoverview This file groups together all the functions relating to the APIs used by the app
 */
import { useRef } from "react";
import { View, StyleSheet, Animated, Alert, ToastAndroid } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import IconButton from "@/components/IconButton";
import { colours } from '@/assets/colours';
import { DeleteFlashcard } from '@/components/LocalDataHandler';
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * 
 * @param JSON flashcardData The data of the flashcard to display
 * @param boolean wasCorrect was this flashcard answered correctly by the user
 * @param function The function to callback to if the user chooses to delete the flashcard
 * @returns 
 */
export default function FlashcardFullViewSmall({flashcardData, wasCorrect, onDelete})
{
    const animationRange = useRef(new Animated.Value(1)).current;

    const deletionRange = animationRange.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    });

    const deleteAnimation = () =>
    {Animated.timing(animationRange, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
    }).start(({ finished }) => {
        if (finished) {
            onDelete(flashcardData.id)
        }
    })}

    /**
     * Delete the flashcard from local storage
     */
    async function DeleteCard()
    {
        await DeleteFlashcard(flashcardData.id), 
        ToastAndroid.show("Flashcard Deleted", ToastAndroid.SHORT)
        deleteAnimation()
    }

    /**
     * @returns Pop up alert to confirm flashcard deletion
     */
    const deletionAlert = () =>
        Alert.alert('Are you sure you want to delete this flashcard?', 'The flashcard can\'t be restored', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => DeleteCard()},
    ]);

    return(
            <Animated.View style={[localStyles.smallFlashcard, {opacity: deletionRange}]}>
                <View>
                    <View style={{flexDirection: 'row', alignItems: 'center', }}>
                        <ThemedText type="defaultBold" style={{flex : 1}}>Question:</ThemedText>
                        <Ionicons name={(wasCorrect) ? "checkmark-circle" : "close-circle"} size={40} style={{color : wasCorrect ? colours.green : colours.red, }}/>
                    </View>
                    <ThemedText>{flashcardData.question}</ThemedText>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <ThemedText type="defaultBold" style={{flex: 1}}>Answer:</ThemedText>
                        <IconButton iconName="trash" background={true} onPress={deletionAlert}/>
                    </View>
                    <ThemedText>{flashcardData.answer}</ThemedText>
                </View> 
            </Animated.View>
        )
}

const localStyles = StyleSheet.create({
       smallFlashcard : {
        backgroundColor: colours.lightBlue,
        borderRadius: 10,
        borderColor: colours.blue,
        borderWidth: 2,
        marginVertical : 3,
        paddingHorizontal: 5,
        alignSelf: 'center',
        width: '95%'
    }
})