/**
 * @fileoverview This file contains the translation setting header used in the translation home and intent filter tabs
 */
import Dropdown from '@/components/Dropdown';
import languageCodes from '@/assets/languageCodes';
import IconButton from '@/components/IconButton';
import { View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { colours } from '@/assets/colours';
import { SetSettingValue, LoadSettingValue } from './LocalDataHandler';

/**
 * Header that allows for switching the configured languages to translate from and to
 * @param
 * @param
 */
export default function TranslationSettingHeader({onChangeSourceLanguage, onChangeTargetLanguage})
{
    const [sourceLanguage, SetSourceLanguage] = useState("de")
    const [targetLanguage, SetTargetLanguage] = useState("en")

    useEffect(() => {
        (async()=> {
            var _sourceLanguage = await LoadSettingValue("sourceLanguage")
            if(_sourceLanguage != null)
                SetSourceLanguage(_sourceLanguage)

            var _targetLanguage = await LoadSettingValue("targetLanguage")
            if(_targetLanguage != null)
                SetTargetLanguage(_targetLanguage)
        })()
    }, [])

    useEffect(() => {
        onChangeSourceLanguage(sourceLanguage)
        onChangeTargetLanguage(targetLanguage)
    }, [sourceLanguage, targetLanguage])

    /**
     * Swap the selected languages
     */
    function SwapLanguage()
    {
        var _sourceLanguage = targetLanguage
        var _targetLanguage = sourceLanguage
        SetSourceLanguage(_sourceLanguage)
        SetTargetLanguage(_targetLanguage) 
    }

    return (
        <View style={localStyles.headingContainer}>
          <View style={{width: '37%'}}>
            <Dropdown options={languageCodes} style={localStyles.languageDropdown}
            selectedValue={sourceLanguage}
            onChange={(value) => {SetSourceLanguage(value); SetSettingValue("sourceLanguage", value)}}/>
          </View>
          <View style={{width: '15%'}}>
            <IconButton iconName='swap-horizontal' size={25} onPress={()=> SwapLanguage()} style={{margin: 5, alignSelf : 'center'}}
              background={false} iconStyle={{color : 'white'}}/>
          </View>
          <View style={{width: '37%' }}>
            <Dropdown options={languageCodes} style={localStyles.languageDropdown}
            selectedValue={targetLanguage}
            onChange={(value) => {SetTargetLanguage(value), SetSettingValue("targetLanguage", value)}}/>
          </View>
        </View>
    )
}

const localStyles = StyleSheet.create({
    languageDropdown : {
        backgroundColor: colours.darkBlue, 
        borderRadius: 10, 
        alignItems: 'center', 
        justifyContent: 'center',
        height: 50
    },
    headingContainer : {
        flexDirection: 'row', 
        alignItems: "center", 
        justifyContent: 'center', 
        padding: 15, 
        alignSelf: 'center', 
        height: '100%'
    }
})