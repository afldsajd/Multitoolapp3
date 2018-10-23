// durchschnitt für mehr als zwei Messungen - trotzdem stark daneben
// Resetbutton deaktiviert
// Fehlermessungen (zu kleine Messungen) rausgenommen, weil das meistens Fehler sind


import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, Button, TextInput, ScrollView } from 'react-native';
import { Accelerometer } from "expo";
import styles from './styles';


export default class Bewegungsmesser extends React.Component {
    state = {
        buttontitle: "Start",
        buttontitle2: "",
        x: 0,
        y: 0,
        z: 0,
        ausgabe: 0,
        ausgabe2: 0,
        isAverage: false,
        fehlercode1: ''
    };

    helper = {
        c: 0,
       
        averageIndicator: 0,
    };

    measurementData = []

    durchschnittler = []
    durchschnittler2 = []
    

    constructor(props) {
        super(props);    
        Accelerometer.setUpdateInterval(10);
    }

    Start = (val) => {
        if (this.state.buttontitle == "Start") {
            console.log("Start");
            
            this.setState({
                    buttontitle: "Stop",
                    fehlercode1: ''
                })
            Accelerometer.setUpdateInterval(10);
            Accelerometer.addListener(accelerometerData => {
                
                this.measurementData.push({
                    x: accelerometerData.x*9.81, 
                    y: accelerometerData.y*9.81,
                    z: accelerometerData.z*9.81-9.81,
                })
            });

            this.measurementData = []   

        } else if (this.state.buttontitle == "Stop") {
            
            console.log("stop");
            Accelerometer.removeAllListeners()
            
            let data = this.measurementData;       
            let sx = 0;
            let vox = 0;
            let sy = 0;
            let voy = 0;
            let g = 0;
            let dpem = 0;
            let d = 0;
            let c = 0;
            
            let cleanedData = data.map((a) => {
                let x = a.x
                if (x > -0.5 && x < 0.5 ) {
                    x = 0
                }

                let y = a.y
                if (y > -0.5 && y < 0.5 ) {
                    y = 0
                }

                return {x: x, y:y}
            })
            
            while(this.allZero(cleanedData.slice(g, g+10)) && g <= cleanedData.length) {
                g++;
            }

            while(!this.allZero(cleanedData.slice(g, g+10)) && g <= cleanedData.length) {
                sx += (cleanedData[g].x/2)*(0.01*0.01)+(vox*0.01);
                vox += (cleanedData[g].x*0.01);
    
                sy += (cleanedData[g].y/2)*(0.01*0.01)+(voy*0.01);
                voy += (cleanedData[g].y*0.01);
               
                g++
            }
            c = Math.sqrt(sx*sx+sy*sy);
            if (Math.abs(c) > 0.01) {
                this.durchschnittler2 = this.durchschnittler.push(c);
                for (let y = 0; y < this.durchschnittler.length; y++) {
                    dpem += this.durchschnittler[y];
                }
                d = dpem / this.durchschnittler.length;    
                console.log(this.durchschnittler);
                console.log(this.durchschnittler2)
                console.log(d);        

                this.setState({
                    ausgabe: Math.round(c * 100) / 100,
                    ausgabe2: Math.round(d * 100) / 100,
                    buttontitle: "Start",
                })

                this.measurementData = [];

            } else {
                this.setState({
                    fehlercode1: 'zu kleine Messung',
                    buttontitle: "Start",
                })
            }
        }        
    }

    Loschen = () => {
        if (this.state.buttontitle == "Start") {
        this.setState({
            buttontitle: "Start",
            buttontitle2: "",
            x: 0,
            y: 0,
            z: 0,
            ausgabe: 0,
            ausgabe2: 0,
            isAverage: false,
            fehlercode1: ''
        })
        this.helper.c = 0;
        this.helper.averageIndicator = 0;
        this.durchschnittler = []
        this.durchschnittler2 = []
        }
    }

    allZero = (data) => {
        let count = 0;
        for (let h = 0; h < data.length; h++) {
            if (data[h].x == 0 && data[h].y == 0) {
                count ++;
            }
        }
        
        if (count >= data.length * 0.8 ) {
            return true
        }

        return false
    } 

    render () {
        return (
            <ScrollView>
                <View style={styles.container}>
                <Text style={styles.headertext}>Distanzmessung</Text>
                    <View style={[styles.inputContainer, {maxHeight: 350}]}>
                        <Text style={styles.inputText}>Legen Sie Ihr Smartphone auf eine gerade Unterlage. Starten Sie die Messung und bewgen Sie das Gerät zügig zur Zielposition. Stoppen Sie die Messung. Um genauere Ergebnisse zu erzielen, können Sie die Messung mehrmals durchführen.</Text>
                        <Button onPress={this.Start} title={this.state.buttontitle}></Button>
                    </View>                
                    <View style={styles.outputContainer}>
                        {this.state.indicatorStatus ? <ActivityIndicator size="large"/> : null}
                        <View style={[styles.notification, styles.outputContainer, {backgroundColor: '#ccc'}]}>
                            <Text style={styles.outputText}>Aktuelle Messung: {this.state.ausgabe} m</Text>
                            <Text style={styles.outputText}>Durchschnitt: {this.state.ausgabe2} m</Text>
                        </View>
                        {this.state.isAverage ? <View style={[styles.notification, styles.outputContainer, {backgroundColor: '#FE4141'}]}>
                            <Text style={styles.outputText}>Sie können maximal 2 Messungen durchführen! Drücken Sie 'RESET'.</Text>
                        </View> : null}
                        <View style={styles.outputContainer}>
                            <Button onPress={this.Loschen} title="Reset"/>
                            <Text style={styles.outputText}> {this.state.fehlercode1} </Text>
                        </View>
                        
                    </View>
                </View>
            </ScrollView>
            

    )}
}