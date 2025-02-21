/**
 * @fileoverview This file contains the initial entry point of the application
 */
import { Redirect} from 'expo-router';
import React, { useEffect, useState } from 'react';
import { getProcessTextIntent } from 'react-native-process-text-intent';
import Constants, { ExecutionEnvironment } from 'expo-constants'
import * as Linking from 'expo-linking';
import { View } from 'react-native';

/**
 * @fileoverview The default root screen of the project, returns a redirect to change to the actual root page. Required since expo router looks for this file
 */
export default function index()  {
  const [redirectElement, SetRedirect] = useState([])
  const url = Linking.useURL();

  useEffect(() =>
  {
    CheckProcessIntent()
  }, [])

  /**
   * 
   * Has to be async sinc getProcessTextIntent is async
   */
  async function CheckProcessIntent()
  {
    var redirectHref = {pathname: "/(tabs)/TranslationHomeScreen"}

    //the get process text intent package doesnt work in expo go so you have to check for the process environment
    if(Constants.executionEnvironment !== ExecutionEnvironment.StoreClient)
    {
      var intentResult = await getProcessTextIntent()

      if(intentResult != null)
        redirectHref = {pathname: "/(tabs)/intentFilterScreen"}
      else if(url) {
          const { queryParams } = Linking.parse(url);
          redirectElement = {pathname: "/(tabs)/TranslationHomeScreen", params : {initialFieldValue : JSON.stringify(queryParams)}}
      }
    }

    SetRedirect(<Redirect href={redirectHref}/>)
  }

  return <View>{redirectElement}</View>
};