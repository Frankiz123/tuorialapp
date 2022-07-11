import React, {useContext, useState, useEffect} from "react";
import {SafeAreaView, Text, View, StyleSheet, Image, TouchableHighlight,TouchableOpacity, ActivityIndicator, Linking, AppState} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function JoinMeeting({route, navigation}) {
    const {TutorData, userData} = route.params;
    const[meetingID, setMeetingID] = useState('');
    const[meetingPass, setMeetingPass] = useState('');
    const[meetingarr, setArray] = useState([]);
    const[loading, setLoading] = useState(true);
    const [appState, setAppState] = useState('');
    
    var List = [];
    useEffect(() => {
        var unsubscribe =   firestore().collection('Meetings').doc(userData.ID).onSnapshot(querySnapShot => {
            if(querySnapShot.exists){
                    List.push({...querySnapShot.data(),
                                key: querySnapShot.id })
                                
                
                        setArray(List);
                        var obj;
                        for(var i=0;i<List.length; i++){
                        const dataset = List[i].MeetingInformation;
                        obj = Object.values(dataset);
                        console.log("requests ", List[i].MeetingInformation);
                        }
                        setLoading(false);
                        console.log('tutor', TutorData.ID)
                        let number = obj.findIndex(e=> {return TutorData.ID == e.TutorID})
                        if(number!='-1'){
                       console.log(obj[number].MeetingPass)
                       setMeetingPass(obj[number].MeetingPass)
                       setMeetingID(obj[number].MeetingID);
                        }
                       console.log('pass', meetingPass)
                       console.log('ID', meetingID)
    
                    }
            })
        

            AppState.addEventListener('change', _handleAppStateChange);
            return() => {
                AppState.removeEventListener('change', _handleAppStateChange);
            unsubscribe();
            }
    }, [])

   const _handleAppStateChange = (state) => {
        setAppState(state);
        console.log(state);
    }
    if(loading){
        return (
            <ActivityIndicator>

            </ActivityIndicator>
        )
    }

    return(
        appState === 'background' ?
        <SafeAreaView>
            <View style = {{ justifyContent: 'center', alignItems: 'center', marginTop: '50%'}}>

            
            <TouchableOpacity style = {{ backgroundColor: '#6d95da', width: '70%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 0}} onPress={() => Linking.openURL('zoomus://zoom.us/join?confno=' + meetingID +'&zc=0&browser=chrome&pwd=' + meetingPass)}>
            <Text>Join me</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
        : 
        appState === 'active' ?
        <SafeAreaView>
            <View style = {{ justifyContent: 'center', alignItems: 'center', marginTop: '50%'}}>
            <TouchableOpacity style = {{ backgroundColor: '#6d95da', width: '70%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 0}} onPress={() => Linking.openURL('zoomus://zoom.us/join?confno=' + meetingID +'&zc=0&browser=chrome&pwd=' + meetingPass)}>
            <Text>Join me</Text>
            </TouchableOpacity>

            <TouchableOpacity style = {{marginTop: 30, backgroundColor: '#6d95da', width: '70%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 0}} >
            <Text>Pay</Text>
            </TouchableOpacity>
            
            </View>
        </SafeAreaView>
        : 
        <SafeAreaView>
            <View style = {{ justifyContent: 'center', alignItems: 'center', marginTop: '50%'}}>
            <TouchableOpacity style = {{ backgroundColor: '#6d95da', width: '70%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 0}} onPress={() => {Linking.openURL('zoomus://zoom.us/join?confno=' + meetingID +'&zc=0&browser=chrome&pwd=' + meetingPass)}}>
            <Text>Join me</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}