import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, ActivityIndicator, Button, TextInput, Picker } from 'react-native';
import styles from './styles';

export default class Zinsber extends React.Component {
  state = {
      startkapital: '',
      zeit: '',
      gewinn: '',
      endkapital: '',
      zins: '', 
      intervall: '',
  };
  Loschen = () => {
    this.setState({
        startkapital: '',
        zeit: '',
        gewinn: '',
        endkapital: '',
        zins: '', 
        intervall: '',
    })
  }
  Startkapital = (x) => {
    this.setState({
        startkapital: x, 
    })
  }
  Zinssatz = (x) => {
      this.setState({
          zins: x,
      })
  }
  Zeit = (x) => {
      this.setState({
          zeit: x,
      })
  }
  berechnenGewinn = () => {
    let ze = parseFloat(this.state.zeit);
    let st = parseFloat(this.state.startkapital);
    let zi = parseFloat(this.state.zins)/100+1;
    let en = st;
    let ge = 0; 
    for (let t = 0; t < ze; t++) {
        en = en * zi
    }
    en = en.toFixed(2);
    ge = en - st;
    ge = ge.toFixed(2);
    this.setState({
        endkapital: "Ihr Endkapital beträgt " + en + "€.",
        gewinn: "Ihr Gewinn beträgt " + ge + "€.",
    })
  }
  
  render() {
    return (
        <View style={styles.container}>
                <Text style={styles.headertext}>Zinsrechner</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Startkapital (€):</Text>
                <TextInput onChangeText={this.Startkapital} value={this.state.startkapital} style={styles.inputText} placeholder="0"></TextInput>
                <Text style={styles.inputText}>Zinssatz (%):</Text>
                <TextInput onChangeText={this.Zinssatz} value={this.state.zins} style={styles.inputText} placeholder="0"></TextInput>
                <Text style={styles.inputText}>Laufzeit:</Text>
                <TextInput onChangeText={this.Zeit} value={this.state.zeit} style={styles.inputText} placeholder="0"></TextInput>
            </View>
                <Button onPress={this.berechnenGewinn} title="Zins berechnen"/>
            <View style={styles.outputContainer}>
                <Text style={styles.outputText}>{this.state.gewinn}</Text>
                <Text style={styles.outputText}>{this.state.endkapital}</Text>
                <Button onPress={this.Loschen} title="Reset"/>
            </View>
        </View>
    )    
  }
}  