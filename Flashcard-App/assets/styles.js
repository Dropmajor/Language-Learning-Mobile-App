/**
 * @fileoverview This file contatins the styles that see reuse throughout different files
 */
import { StyleSheet } from "react-native";
import { colours } from "./colours";

export default styles = StyleSheet.create({
    parentContainer: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor : colours.blue
    },
    headingContainer: {
      flexDirection: 'row', 
      alignItems: "center", 
      justifyContent: 'center', 
      padding: 15, 
      alignSelf: 'center', 
      height: '9%'
    },
    contentContainer: {
      backgroundColor: 'white', 
      borderTopLeftRadius : 30, 
      borderTopRightRadius : 30, 
      paddingTop: 10,
      flex: 19,
      width: '100%'
    },
    defaultText: {
      fontSize: 16,
      lineHeight: 24,
    },
    defaultBold: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 32,
    },
    subtitle: {
      fontSize: 20.1,
      fontWeight: 'bold',
    },
    CategoryContainer : {
      width : '22%',
      borderRadius : 10,
      height: 35,
      justifyContent: 'center',
      alignItems: 'center'
  },
  bottomButtonContainer: {
    flexDirection: "row", 
    justifyContent: "space-around", 
    flex: 1.6, 
    padding : 2
  }
});  