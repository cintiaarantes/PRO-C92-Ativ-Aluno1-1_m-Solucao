//Aula 91: Construção da Tela de Meteoros

import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, Alert, FlatList, Image, ImageBackground, Dimensions } from 'react-native';
import axios from 'axios';

export default class MeteorScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meteors: {},
    };
  }

  componentDidMount() {
    this.getMeteors();
  }

  //Função getMeteors, usando axios para buscar os dados da API da NASA.
  getMeteors = () => {
    axios
      .get(
        'https://api.nasa.gov/neo/rest/v1/feed?&api_key=5bXVptYdKh2p7Y6KTxRxgbvL0df4X89FiMjsdh8B'
      )
      .then((response) => {
        //Usando o método .then() para passar os dados obtidos:
        //E armazenando o response.data em this.state.meteors no formato JSON.
        this.setState({ meteors: response.data.near_earth_objects });
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  
  render() {
    //Aula 72: Colocando uma condição quando os dados ainda não tiverem carregados, aparecer uma msg de: carregando
    if (Object.keys(this.state.meteors).length === 0) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Carregando...</Text>
        </View>
      );
    } else {
      //Desafio 01: Criar uma variável para receber toda a matriz de dados dos meteoros de todos os 7 dias
      let meteor_arr = Object.keys(this.state.meteors).map((meteor_date) => {
        return this.state.meteors[meteor_date];
      });
      
      //Desafio 02: É necessário concatenar (juntar) todas as matriz de dados dos dias em uma outra matriz mestre
      let meteors = [].concat.apply([], meteor_arr);
      
      //Aula 72: Função para cálculo da pontuação de ameaça dos meteoros
      meteors.forEach(function (element) {
        //Aula 72: Cálculo da média dos diâmetros mínimos e máximos
        let diameter =
          (element.estimated_diameter.kilometers.estimated_diameter_min +
            element.estimated_diameter.kilometers.estimated_diameter_max) /
          2;
        
        //Desafio 3: Cálculo da pontuação de ameaça:
        let threatScore =
          (diameter / element.close_approach_data[0].miss_distance.kilometers) *
          1000000000;
        element.threat_score = threatScore;
      });
    }
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.androidSafeArea} />
        <Text>Tela de Meteoros</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  androidSafeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
