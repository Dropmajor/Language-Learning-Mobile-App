/**
 * @fileoverview This file contains the Flashcard full view component which is used in the quiz page tab
 */
import { View, StyleSheet, Animated } from "react-native";
import { ThemedText } from "./ThemedText";
import TextButton from "./TextButton"
import { useEffect, useRef, useState } from "react";

/**
 * Component to display the question and answer of a flashcard as part of a self test
 * @param {JSON} flashcardData The data of the flashcard to display
 * @param {function} answeredCallback The function to call when the user chooses the flashcard answer
 * @param {function} proceedCallback  The function to call when the user wants to show the next flashcard
 * @returns 
 */
export default function FlashcardFullView({flashcardData, answeredCallback, proceedCallback}) {

    const [showAnswer, ChangeAnswerDisplayState] = useState(false)
    const animationRange = useRef(new Animated.Value(0)).current;

    const openFlashcard = animationRange.interpolate({
        inputRange: [0, 1],
        outputRange: [-750, 750]
    });
  
    const openAnimation = 
    Animated.timing(animationRange, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
    })

    const closeAnimation = () =>
    {Animated.timing(animationRange, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
    }).start(({ finished }) => {
        if (finished) {
            proceedCallback()
        }
    })}

    useEffect(() => {
        openAnimation.start()
    }, [])


    return(
            <Animated.View style={[localStyles.container, {transform: [{ translateX: openFlashcard }]}]}>
                <View style={{height : '90%'}}>
                    <View style={{flex: 1}}>
                        <ThemedText type="defaultBold">Question:</ThemedText>
                        <ThemedText>{flashcardData.question}</ThemedText>
                    </View>
                    {(showAnswer) ? 
                    <View style={{flex: 1}}>
                        <ThemedText type="defaultBold">Answer:</ThemedText>
                        <ThemedText >{flashcardData.answer}</ThemedText>
                    </View>: []}
                </View> 
                {(showAnswer) ? <TextButton onPress={()=> closeAnimation()} style={{height : 40}}>Proceed</TextButton> : 
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', bottom: 30}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
                            <TextButton style={{width : '45%', height : 40}}
                                onPress={()=> {ChangeAnswerDisplayState(true), answeredCallback(true, flashcardData)}}>I know this</TextButton>
                            <TextButton style={{width : '45%', height : 40}}
                                onPress={()=> {ChangeAnswerDisplayState(true), answeredCallback(false, flashcardData)}}>I don't know this</TextButton>
                        </View>
                    </View>}
            </Animated.View>
    )
}

const localStyles = StyleSheet.create({
    container : {
        backgroundColor : 'white',
        height : '90%',
        borderRadius : 50,
        padding: 20,
        width : '97%'
    },
    answerButton : {

    }
})