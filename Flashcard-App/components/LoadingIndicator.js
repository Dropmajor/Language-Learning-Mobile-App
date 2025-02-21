/**
 * @fileoverview This file contains the loading indicator and its related segment component
 */
import { View, Animated } from "react-native";
import { useRef, useEffect } from "react";

/**
 * 
 */
export default function LoadingIndicator()
{
    /**
     * Creates 12 indicator segements to form a full circle
     */
    function CreateIndicatorSegments()
    {
        var segments = []
        var angleIncrement = 360 / 12
        for(var i = 0; i < 12; i++)
        {
            segments.push(
                <IndicatorSegment angle={angleIncrement * i} animationOffset={1/12 * i} key={i}/>
            )
        }
        return segments
    }

    return(
        <View style={{width: 60, height: 60, justifyContent: 'center', alignItems: "center"}}>
            {CreateIndicatorSegments()}
        </View>
    )
}

/**
 * A rectangular segment of the loading indicator uses colour changing animation to appear to spin
 * @param int angle The angle to rotate this segment by
 * @param int animationOffset How much to offset the start of the colour changing animation by
 * @returns 
 */
function IndicatorSegment({angle, animationOffset}) 
{
    const animatedColour = useRef(new Animated.Value(animationOffset)).current;
    const colour = animatedColour.interpolate({
        inputRange: [0, 1],
        outputRange: ['#E0E0E0', '#9E9E9E']
    });

    useEffect(() => {
        if(animationOffset < 0.5) { 
            Animated.sequence([
                Animated.timing(animatedColour, {
                    toValue: 1,
                    duration: 2500 * (1 - animationOffset),
                    useNativeDriver: true,
                }),
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(animatedColour, {
                            toValue: 1,
                            duration: 250,
                            useNativeDriver: true,
                        }),
                        Animated.timing(animatedColour, {
                            toValue: 0,
                            duration: 2350,
                            useNativeDriver: true,
                        }),
                    ])
                )
            ]).start();
        }
        else
        {
            Animated.sequence([
                Animated.timing(animatedColour, {
                    toValue: 0,
                    duration: 2500 * (1 - animationOffset),
                    useNativeDriver: true,
                }),
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(animatedColour, {
                            toValue: 1,
                            duration: 250,
                            useNativeDriver: true,
                        }),
                        Animated.timing(animatedColour, {
                            toValue: 0,
                            duration: 2350,
                            useNativeDriver: true,
                        }),
                    ])
                )
            ]).start();
        }
    }, []);

    return(
        <View style={{width: 4, height: 40,
            transform: [{rotate: (angle + 'deg')}], position: 'absolute'
            }}>
            <Animated.View style={{height: 10, backgroundColor: colour, borderRadius: 10}}/>
        </View>
    );
}
