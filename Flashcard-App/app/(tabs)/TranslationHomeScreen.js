import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import styles from '@/assets/styles';
import TranslationSettingHeader from '@/components/TranslationSettingHeader'
import { useLocalSearchParams } from 'expo-router';
import TranslationContainer from '@/components/TranslationContainer'

/**
 * The home translation screen of the application
 */
export default function TranslationHomeScreen() {
  //this is used to stop the screen from moving when the keyboard is opened
  const windowHeight = useWindowDimensions().height;
  const [sourceLanguage, SetSourceLanguage] = useState("de")
  const [targetLanguage, SetTargetLanguage] = useState("en")
  const { initialFieldValue } = useLocalSearchParams();

  return (
    <View style={[styles.parentContainer, {minHeight: Math.round(windowHeight)}]}>
      <View style={styles.headingContainer}>
        <TranslationSettingHeader onChangeSourceLanguage={SetSourceLanguage} onChangeTargetLanguage={SetTargetLanguage}/>
      </View>
      <TranslationContainer sourceLanguage={sourceLanguage} targetLanguage={targetLanguage} initialValue={initialFieldValue}/>
    </View>
  );
}