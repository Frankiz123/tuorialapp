import React, {useContext, useState, useEffect} from "react";
import {SafeAreaView, Text, View, StyleSheet, Image, TouchableHighlight,TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { SearchBar, Card } from 'react-native-elements';
import { TextInput } from "react-native-gesture-handler";
import Modal from "react-native-modal";

import firestore from '@react-native-firebase/firestore';
export default function Confirmation(props) {
    const{userData} = props;
    const ref = firestore().collection('Requests');
    const[array, setArray] = useState([]);
    const[isvisible, setVisible] = useState(false);
    const[requests, setRequests] = useState('');
    const[loading, setLoading] = useState(true);
    const[requeststatus, setrequestStatus] = useState(false);
    const[password, setPassword] = useState('');
    const[meetingID, setMeetingID] = useState('');
    const[studentID, setStudentID] = useState('');
    const[meetingarr, setmeetingarr] = useState({});
    const[keylist, setKeyList] = useState([]);
    var List = []
    var MeetingInfo=[];
    const tutorinfo = [];
   var obj;
   var key;
    useEffect(() => {
       
      }, []);
   console.log('outsid', requests)

    return(
        <SafeAreaView>
        <View style = {{marginTop: 10, height: '100%'}}>
            
       
        </View>
        </SafeAreaView>

    )
}