/**
 * @fileoverview This file contains the flashcard management screen
 */
import { View, FlatList, useWindowDimensions, StyleSheet, TextInput } from "react-native";
import { ThemedText } from "@/components/ThemedText"
import styles from '@/assets/styles';
import { useState, useCallback, useRef } from "react";
import { LoadFlashCards } from "@/components/LocalDataHandler";
import FlashcardMinimalView from "@/components/FlashcardMinimalView";
import LoadingIndicator from "@/components/LoadingIndicator";
import CategorySelector from "@/components/CategorySelector";
import { router, useFocusEffect } from 'expo-router';
import { colours } from '@/assets/colours';
import IconButton from "@/components/IconButton";
import TextIconButton from "@/components/TextIconButton";
import AntDesign from '@expo/vector-icons/AntDesign';

/**
 * The screen from which all saved flashcards can be viewed and edited from
 */
export default function FlashcardManagementScreen()
{
    const flashcardCategories = ["All", "Word", "Grammer", "Context"]
    const [awaitingFlashcards, ChangeAwaitingState] = useState(false)
    const [Flashcards, SetFlashcards] = useState(null)
    const [Category, SetCategory] = useState("All")
    const [searching, ChangeSearchingState] = useState(false)
    const [searchValue, SetSearch] = useState("")
    const searchField = useRef(null)
    const windowHeight = useWindowDimensions().height;

    useFocusEffect(
        useCallback(() => {
            return () => {
                ChangeSearchingState(false)
                SetSearch("")
            };
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            if(awaitingFlashcards != true)
                LoadAllFlashcards()

            return () => {
            };
        }, [Category, searchValue])
    );

    /**
     * Loads all flashcards from the database so that they can be display
     */
    async function LoadAllFlashcards()
    {
        ChangeAwaitingState(true)
        var LoadedFlashcards = await LoadFlashCards(Category, searchValue)
        ChangeAwaitingState(false)
        SetFlashcards(LoadedFlashcards)
    }

    return(
        <View style={[styles.parentContainer, {minHeight: Math.round(windowHeight)}]}>
            <View style={styles.headingContainer}>
                <View style={{flex : 1}}>
                    {(searching) ? <IconButton iconName="arrow-back" onPress={() => {ChangeSearchingState(false), SetSearch("")}}/> : []}
                </View>
                <View style={{flex : 4, alignItems : 'center'}}>
                    {(!searching) ? <ThemedText type="subtitle" style={{color: 'white'}}>Saved Flashcards</ThemedText> :
                        <TextInput placeholder="Enter Flashcard Question to find..." style={[styles.defaultBold, localStyles.searchField]}
                        ref={searchField} onChangeText={(e) => SetSearch(e)}/> }
                </View>
                <View style={{flex : 1, alignItems: 'flex-end'}}>
                    <IconButton iconName="search" onPress={() => ChangeSearchingState(true)} style={{color : 'white'}}/>
                </View>
            </View>
            <View style={styles.contentContainer}>
                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row', paddingLeft: 10, paddingBottom: 5}}>
                        <AntDesign name="filter" size={24} color="black" />
                        <ThemedText type="defaultBold">Filter Flashcards by Category: </ThemedText>
                    </View>
                    <CategorySelector categories={flashcardCategories} onValueChange={SetCategory} style={{marginBottom : 3}}/>
                </View>
                
                <View style={{flex: 9, flexDirection: 'row',justifyContent: 'space-evenly',}}>
                    {(awaitingFlashcards) ? <View><LoadingIndicator/><ThemedText>Retrieving Saved Flashcards...</ThemedText></View> :
                    <FlatList data={Flashcards} persistentScrollbar={true}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => <FlashcardMinimalView flashcardData={item}/>}
                    ListFooterComponent={
                        <View style={localStyles.listFooter}>
                            <View style={{alignItems: 'center', paddingBottom: 20}}>
                                <ThemedText type='defaultBold'>Looks a little empty in here</ThemedText>
                                <ThemedText type='small' style={{color: 'grey'}}>Try adding some more flashcards</ThemedText>
                            </View>
                        </View>
                    }/> }
                </View>
                <View style={styles.bottomButtonContainer}>
                    <TextIconButton iconName="add" style={{backgroundColor : colours.blue, width : '80%', height: 50}}
                        onPress={() => router.push({pathname: '/(tabs)/EditFlashcardScreen'})}>Create Flashcard</TextIconButton>
                </View>
            </View>
        </View>
    )
}

const localStyles = StyleSheet.create({
    FlashcardList: {
        justifyContent: 'space-around',
    },
    searchField : {
        backgroundColor : colours.grey,
        borderColor : 'grey',
        borderWidth : 2,
        height : 45,
        width: '100%',
    }
})