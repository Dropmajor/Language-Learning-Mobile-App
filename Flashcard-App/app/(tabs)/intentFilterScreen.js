/**
 * @fileoverview This file groups contains the screen that is opened when the user opens the app using the android text selection context menu
 */
import { View, BackHandler, useWindowDimensions} from "react-native"
import IconButton from "@/components/IconButton"
import { getProcessTextIntent } from 'react-native-process-text-intent';
import styles from '@/assets/styles';
import TranslationContainer from '@/components/TranslationContainer'
import * as Linking from 'expo-linking';
import { useEffect, useState } from "react";
import TranslationSettingHeader from '@/components/TranslationSettingHeader'

/**
 * This is the screen that is opened when the user opens the app using the android text selection context menu
 * This screen is only accessible when the app is opened using a text intent. Additionally it wont work using expo go
 * @returns 
 */
export default function InBrowserPopOutScreen()
{
  const windowHeight = useWindowDimensions().height;
  const [sourceLanguage, SetSourceLanguage] = useState("de")
  const [targetLanguage, SetTargetLanguage] = useState("en")
  const [intentFilteredValue, SetIntentFilterValue] = useState("")

  useEffect(() => {
    (async()=> {
        SetIntentFilterValue(await getProcessTextIntent())
    })()
  }, [])

  /**
   * Use expo deep links to reopen the actual instance of the app
   */
  function ReopenApp()
  {
      Linking.openURL('myapp://?initialValue=' + intentFilteredValue)
      BackHandler.exitApp(); //close this instance since it is no longer needed
  }

  return (<View style={[styles.parentContainer, {minHeight: Math.round(windowHeight)}]}>
        <View style={[{flexDirection : 'row'}, styles.headingContainer]}>
          <View style={{flex: 1}}>
            <IconButton iconName="arrow-back" onPress={() => BackHandler.exitApp()} />
          </View>
          <TranslationSettingHeader onChangeSourceLanguage={SetSourceLanguage} onChangeTargetLanguage={SetTargetLanguage}/>
          <View style={{flex: 1, alignItems : 'flex-end'}}>
            <IconButton iconName="open-outline" onPress={() => ReopenApp()}/>
          </View>
        </View>
        <TranslationContainer sourceLanguage={sourceLanguage} targetLanguage={targetLanguage} initialValue={intentFilteredValue}/>
      </View>)
}