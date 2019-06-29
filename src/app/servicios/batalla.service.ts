import { Injectable } from '@angular/core';
import {ObtieneDatosService} from '../../app/servicios/obtiene-datos.service';

@Injectable({
  providedIn: 'root'
})
export class BatallaService {

  actualPokemon = null;
  actualPokemonRival = null;
  equipoPokemon = [];
  equipoRivalPokemon = [];
  nivel = 0;
  niveles = [15, 50, 100];
  tablaTipos=[];

  //Todos los datos a usar durante las batallas se guardarán en este servicio
  constructor(private obtiene: ObtieneDatosService) { 
    this.obtiene.getEfectividades().subscribe(data => {
      this.tablaTipos = data;
      console.log(this.tablaTipos)
    });
  }


  setearStatsPokemons() {
    let valor = 0;
    let min = 0;
    let max = 0;
    for (let index = 0; index < this.equipoPokemon.length; index++) {
      let pokemon = this.equipoPokemon[index];

      //PS
      min = pokemon.stats[this.nivel].ps[0];
      max = pokemon.stats[this.nivel].ps[1];
      pokemon.batalla.ps = Math.floor(Math.random() * (max - min)) + min + 1;  //Random 

      //ATAQUE
      min = pokemon.stats[this.nivel].ataque[0];
      max = pokemon.stats[this.nivel].ataque[1];
      pokemon.batalla.ataque = Math.floor(Math.random() * (max - min)) + min + 1;  //Random 

      //ATAQUE ESPECIAL
      min = pokemon.stats[this.nivel]['at.especial'][0];
      max = pokemon.stats[this.nivel]['at.especial'][1];
      pokemon.batalla['at.especial'] = Math.floor(Math.random() * (max - min)) + min + 1;  //Random 

      //DEFENSA
      min = pokemon.stats[this.nivel].defensa[0];
      max = pokemon.stats[this.nivel].defensa[1];
      pokemon.batalla.defensa = Math.floor(Math.random() * (max - min)) + min + 1;  //Random 

      //DEFENSA ESPECIAL
      min = pokemon.stats[this.nivel]['def.especial'][0];
      max = pokemon.stats[this.nivel]['def.especial'][1];
      pokemon.batalla['def.especial'] = Math.floor(Math.random() * (max - min)) + min + 1;  //Random 

      //VELOCIDAD
      min = pokemon.stats[this.nivel].velocidad[0];
      max = pokemon.stats[this.nivel].velocidad[1];
      pokemon.batalla.velocidad = Math.floor(Math.random() * (max - min)) + min + 1;  //Random 
    }

  }

  setearStatsPokemonsRival() {
    let valor = 0;
    let min = 0;
    let max = 0;
    for (let index = 0; index < this.equipoRivalPokemon.length; index++) {
      let pokemon = this.equipoRivalPokemon[index];

      //PS
      min = pokemon.stats[this.nivel].ps[0];
      max = pokemon.stats[this.nivel].ps[1];
      pokemon.batalla.ps = Math.floor(Math.random() * (max - min)) + min + 1;  //Random 

      //ATAQUE
      min = pokemon.stats[this.nivel].ataque[0];
      max = pokemon.stats[this.nivel].ataque[1];
      pokemon.batalla.ataque = Math.floor(Math.random() * (max - min)) + min + 1;  //Random 

      //ATAQUE ESPECIAL
      min = pokemon.stats[this.nivel]['at.especial'][0];
      max = pokemon.stats[this.nivel]['at.especial'][1];
      pokemon.batalla['at.especial'] = Math.floor(Math.random() * (max - min)) + min + 1;  //Random 

      //DEFENSA
      min = pokemon.stats[this.nivel].defensa[0];
      max = pokemon.stats[this.nivel].defensa[1];
      pokemon.batalla.defensa = Math.floor(Math.random() * (max - min)) + min + 1;  //Random 

      //DEFENSA ESPECIAL
      min = pokemon.stats[this.nivel]['def.especial'][0];
      max = pokemon.stats[this.nivel]['def.especial'][1];
      pokemon.batalla['def.especial'] = Math.floor(Math.random() * (max - min)) + min + 1;  //Random 

      //VELOCIDAD
      min = pokemon.stats[this.nivel].velocidad[0];
      max = pokemon.stats[this.nivel].velocidad[1];
      pokemon.batalla.velocidad = Math.floor(Math.random() * (max - min)) + min + 1;  //Random 
    }

  }

  atacaPokemon(movimientoUsado) {
    //console.log(this.actualPokemon.tipo1, " vs ", this.actualPokemonRival.tipo1);

    //Si el ataque es del mismo tipo que el Pokémon que lo lanza toma un valor de 1.5, si el ataque es de un tipo diferente al del Pokémon que lo lanza toma un valor de 1.
    let bonificacion = this.verificaTipoMovimientoIgualTipoPokemon(movimientoUsado);

    //Nivel del pokemon que ataca
    let nivel = this.niveles[this.nivel];

    //Cantidad de ataque o ataque especial del Pokémon, depende del tipo de movimeinto usado (fisico/especial)
    let ataque = 0;
    if (movimientoUsado.categoria == "Fisico") {
      ataque = this.actualPokemon.batalla.ataque;
    }
    if (movimientoUsado.categoria == "Especial") {
      ataque = this.actualPokemon.batalla['at.especial'];
    }

    //Poder del ataque, el potencial del ataque
    let poder= movimientoUsado.potencia;

    //Cantidad de defensa o defensa especial del Pokémon rival, depende del tipo de movimeinto usado (fisico/especial)
    let defensa =0;
    if (movimientoUsado.categoria == "Fisico") {
      defensa = this.actualPokemonRival.batalla.defensa;
    }
    if (movimientoUsado.categoria == "Especial") {
      defensa = this.actualPokemonRival.batalla['def.especial'];
    }

    //Es una variable que comprende todos los valores discretos entre 85 y 100 (ambos incluidos).
    let variacion= Math.floor(Math.random() * (100 - 85)) + 86;  //Random 

    //Puede tomar los valores de 0, 0.25, 0.5, 1, 2 y 4
    let efectividad= this.obtenerEfectividadAtaque(movimientoUsado);
    // console.log("ataque:",  ataque)
    // console.log("defensa: ",defensa)
    // console.log("nivel:", nivel)
    // console.log("bonif:",bonificacion)
    // console.log("poder:",poder)
    // console.log("variac:",variacion)
    // console.log("efect:",efectividad)

    let daño = this.obtenerDañoAtaque(ataque , defensa, nivel, bonificacion,poder, variacion, efectividad);

  }

  
  verificaTipoMovimientoIgualTipoPokemon(movimientoUsado) {
    if (movimientoUsado.tipo == this.actualPokemon.tipo1 || movimientoUsado.tipo == this.actualPokemon.tipo2) {
      return 1.5;
    } else {
      return 1;
    }
  }

  obtenerEfectividadAtaque(movimientoUsado){
    //Falta obtener efectividad con base al segundo tipo del pokemon al que se ataca
    let tipo = movimientoUsado.tipo;
    let tipoPokemon= this.actualPokemonRival.tipo1;
    for (let index = 0; index < this.tablaTipos.length; index++) {
      let tipoTabla = this.tablaTipos[index];
       if(tipoTabla.tipo == tipo){ //Si es el mismo tipo del ataque usado, se halla la efectividad del movimiento
          for (let j = 0; j < tipoTabla.atacando_A_tipo.length; j++) {
            let tipoDefendiendo = tipoTabla.atacando_A_tipo[j];
            let typ= Object.keys(tipoDefendiendo)[0];
            if ( typ == tipoPokemon ){
              console.log( tipoDefendiendo[typ] ) //Efectividad de ataque , con solo un tipo
              return tipoDefendiendo[typ];
            }   
          }
       }
    }

    
  }

  obtenerDañoAtaque(ataque , defensa, nivel, bonificacion,poder, variacion, efectividad){
    let daño=0;
    //Algoritmo para conseguir el daño de ataque ... https://pokemon.fandom.com/es/wiki/Da%C3%B1o
    let fact1 = 0.01* bonificacion* efectividad* variacion;
    let fact2= 0.2* nivel+1;
    let fact3= fact2*ataque*poder;
    let fact4= 25*defensa;
    let fact5 = fact3/fact4;
    let fact6 = fact5+2;
    daño = fact1* fact6;
    alert("Daño: "+ daño)
  }



}
