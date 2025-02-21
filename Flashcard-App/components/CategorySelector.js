/**
 * @fileoverview This file contains the category selector component definition
 */
import { View, StyleSheet} from "react-native";
import { ThemedText } from "./ThemedText";
import { useCallback, useState } from "react";
import { colours } from "../assets/colours";
import PressableContainer from "./PressableContainer"
import { useFocusEffect } from "expo-router";
import styles from '@/assets/styles'

/**
 * Component that displays multiple categories that are toggled between
 * @param Array<string> categories The categories to display
 * @param function onValueChange The function to call when the category is changed
 * @param string initialValue Initial category to set the selector to
 * @param bool multiSelect boolean that determines if multiple categories can be selected at the same time or only one
 * @returns The category selector component
 */
export default function CategorySelectorComponent ({categories, onValueChange, initialCategory = null, multiSelect = false})
{
    const [selectedCategory, ChangeSelectedCategory] = useState([categories[0]])
    useFocusEffect(
        useCallback(() => {

            if(multiSelect)
            {
                ChangeSelectedCategory([...categories])
            }
            else if(initialCategory != "" && initialCategory != null)
            {
                for(var i = 0; i < categories.length; i++)
                {
                    if(categories[i] == initialCategory)
                    {
                        ChangeSelectedCategory(categories[i])
                    }
                }
            }

            return () => {
            }
        }, [initialCategory, multiSelect])
    )

    /**
     * Create a category button component for each value in categories
     * @returns A list containing all the created button
     */
    function CreateCategoryButtons()
    {
        var buttons = []
        for(var i = 0; i < categories.length; i++)
        {
            var selected = false
            if(selectedCategory.includes(categories[i]))
                selected = true

            //clone category value for onpress event
            const categoryValue = categories[i]
            buttons.push(<CategoryButton selected={selected} label={categories[i]} 
                onPress={() => {ChangeSelection(categoryValue), onValueChange(categoryValue)}} key={i}/>)
        }
        return buttons
    }

    /**
     * Update the currently category.
     * @param string selectedCategory The newly selected category 
     */
    function ChangeSelection(newSelectedCategory)
    {
        if(multiSelect)
        {
            //could skip cloning the array however a rerender needs to happen
            let newSelectionGroup = [...selectedCategory]
            if(newSelectionGroup.includes(newSelectedCategory))
                newSelectionGroup.splice(newSelectionGroup.indexOf(newSelectedCategory), 1)
            else
                newSelectionGroup.push(newSelectedCategory)
            ChangeSelectedCategory(newSelectionGroup)
        }
        else
        {
            ChangeSelectedCategory([newSelectedCategory])
        }
    }

    return(
        <View horizontal={true} style={localStyles.CategoryViewContainer}>
            {CreateCategoryButtons()}
        </View>
    )
}

/**
 * Component to display one of the category options in the category selector
 * @param {boolean} selected Is the category selected
 * @param {string} label The label to display for the category
 * @param {function} onPress The callback to activate when the button is pressed
 * @returns
 */
function CategoryButton({selected, label, onPress})
{
    var colour = {backgroundColor : colours.blue}
    var textColour = {color : 'white'}

    if(selected)
    {
        colour = {backgroundColor : colours.lightBlue, borderWidth : 2, borderColor: colours.darkBlue}
        textColour = {color : colours.darkBlue}
    }

    return(
        <PressableContainer onPress={onPress} style={[colour, styles.CategoryContainer]}>
            <ThemedText type="defaultBold" style={textColour}>{label}</ThemedText>
        </PressableContainer>
    )
}

const localStyles = StyleSheet.create({
    CategoryViewContainer : {
        width : '100%',
        flexDirection : 'row',
        justifyContent: 'space-evenly',
    },
})