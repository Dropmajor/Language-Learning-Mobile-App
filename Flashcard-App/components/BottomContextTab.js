/**
 * @fileoverview This file contains bottom context tab that is part of the translation container
 */
import { ThemedText } from '@/components/ThemedText';
import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { colours } from '@/assets/colours';
import PressableContainer from '@/components/PressableContainer'

/**
 * Small tab component that sits above the tab bar. Used to contain context elements
 * @param bool showing The show state of the tab
 * @param function onShowStateChanged The function to call when the tab show state is updated
 * @param rest The elements to show within the tab
 * @returns 
 */
export default function ContextTab({showing, onShowStateChanged, ...rest})
{
    //this is used to stop the screen from moving when the keyboard is opened
    const [contextMenuShowing, SetContextMenuShowState] = useState(false)
    const bottomTabHeight = useBottomTabBarHeight()

    useEffect(() => {
        if(showing)
          ChangeContextMenuDisplayState(1)
        else
          ChangeContextMenuDisplayState(0)
    }, [showing]);
       
      const heightRange = useRef(new Animated.Value(0)).current;
      const openContextMenu = heightRange.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -335]
      });
    
      const ChangeContextMenuDisplayState = (toValue = null) => {
        SetContextMenuShowState((typeof(toValue) == 'number') ? toValue == 1 ? true : false : heightRange.__getValue() == 0 ? true : false)
        Animated.timing(heightRange, {
            toValue: (typeof(toValue) == 'number' ? toValue : heightRange.__getValue() == 0 ? 1 : 0) ,
            duration: 125,
            useNativeDriver: true,
        }).start()
        onShowStateChanged((typeof(toValue) == 'number') ? toValue == 1 ? true : false : heightRange.__getValue() == 0 ? true : false)
      }

    return(
        <Animated.View style={[localStyles.MinimisedTab, {height : 375, bottom: bottomTabHeight - 335, transform: [{ translateY: openContextMenu }]}]}>
        <PressableContainer style={[localStyles.ContextTabOpener]} onPress={() => {ChangeContextMenuDisplayState()}}>
          <View style={{flexDirection: 'row'}}>
            <Ionicons name={(contextMenuShowing) ? 'chevron-down' : 'chevron-up'} size={25}/>
            <ThemedText type="defaultBold">{contextMenuShowing ? "Hide Context Examples" : "View Context Examples"}</ThemedText>
            <Ionicons name={(contextMenuShowing) ? 'chevron-down' : 'chevron-up'} size={25}/>
          </View>
        </PressableContainer>
        {rest.children}
      </Animated.View>
    )
}

const localStyles = StyleSheet.create({
    ContextTabOpener: {
      height : 40,
      width : '100%',
      backgroundColor : colours.grey,
      borderTopLeftRadius : 15,
      borderTopRightRadius : 15,
      flexDirection : 'row',
      justifyContent : 'center',
      alignItems : 'center',
    },
    MinimisedTab : {
      position : 'absolute', 
      width: '100%',
      height : '7%'
    },
  })