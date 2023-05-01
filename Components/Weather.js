import {View, Text, SafeAreaView, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Geolocation from 'react-native-geolocation-service'


const openWeatherKey = 'ffb01558d568cc9e884efc22e29003ab'
let url = 'http//api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${openWeatherKey}';

const componentDidMount = () => {
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  }

const Weather = () => {
    const [forecast, setForecast] = useState (null);
    const [refreshing, setRefreshing] = useState (false);

    const loadForecast = async () => {
        setRefreshing(true);
        //ask for permission to access location
        const { status } = await Geolocation.requestPermissionsAsync(); 
        if (satus !== 'granted') {
            Alert.alert('Permission to access location was denied');//  If Permission Denied, Show Alert
            setRefreshing(false);
        }
    
            // Get Current RNLocation
            let position = await Geolocation.getCurrentPositionAsync({enableHighAccuracy: true});

            //Fetches Data From OpenWeatherMap API
            const response = await fetch (`${url}&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
            const data = await response.json(); //Converts Response Into JSON

            if(!response.ok){
                Alert.alert('Error', 'Something went wrong!'); // If Response Is Not OK, Show An Alert
            } 
            else {
            setForecast(data); // Set The Data To The State
            }
            setRefreshing(false);
        }

        //useEffect Is A Hook That Runs After The Component Is Rendered
        useEffect(() => {
            loadForecast();
        },[]);

        if (!forecast) { //If The Forecast Is Not Loaded, Show A Loading Indicatior
            return  (
            <SafeAreaView style={styles.loading} >
                <ActivityIndicator size='large' />
            </SafeAreaView>
            );
        }

        const current = forecast.current.weather[0]; //Get The Current Weather
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
            refreshControl={
                <RefreshControl
                refershing={refreshing}
                OnRefresh={() => loadForecast ()} />
            }
            style={{marginTop:50}}
            >
                <Text style={{alignItems:'center', textAlign: 'center'}}>
                    Your Location
                </Text>
                <View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
    }

    export default Weather

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#ECDBBA',
        },
        title: {
            textAlign: 'center',
            fontSize: 36,
            fontWeight: 'bold',
            color: '#C84B31'
        }
    })