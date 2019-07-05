import { Injectable } from '@angular/core';
import { ObtieneDatosService } from '../../app/servicios/obtiene-datos.service';
import { ToastrService } from 'ngx-toastr';


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
  tablaTipos = [];
  turnoJugador = true; //Siempre inicia jugador 


  //Todos los datos a usar durante las batallas se guardarán en este servicio
  constructor(private obtiene: ObtieneDatosService, private toastr: ToastrService) {
    this.obtiene.getEfectividades().subscribe(data => {
      this.tablaTipos = data;
      console.log(this.tablaTipos)
    });
  }


  //Le agrega a cada pokemon sus stats de rango en relacion a su nivel 
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
      pokemon.batalla.psInicial = pokemon.batalla.ps;

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

  //Le agrega a cada pokemon rival sus stats de rango en relacion a su nivel
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
      pokemon.batalla.psInicial = pokemon.batalla.ps;

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

  //Metodo para retornar un movimiento random del pokemon
  eligeAtaqueRival() {
    let movimientos = this.actualPokemonRival.movimientosBatalla;
    let n = Math.floor(Math.random() * (3 - 0)) + 1;  //Random 
    return movimientos[n];
  }

  atacaPokemon(movimientoUsado) {

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
    let poder = movimientoUsado.potencia;

    //Cantidad de defensa o defensa especial del Pokémon rival, depende del tipo de movimeinto usado (fisico/especial)
    let defensa = 0;
    if (movimientoUsado.categoria == "Fisico") {
      defensa = this.actualPokemonRival.batalla.defensa;
    }
    if (movimientoUsado.categoria == "Especial") {
      defensa = this.actualPokemonRival.batalla['def.especial'];
    }

    //Es una variable que comprende todos los valores discretos entre 85 y 100 (ambos incluidos).
    let variacion = Math.floor(Math.random() * (100 - 85)) + 86;  //Random 

    //Puede tomar los valores de 0, 0.25, 0.5, 1, 2 y 4
    let efectividad = 0;
    if (this.actualPokemonRival.tipo2 == null) {
      efectividad = this.obtenerEfectividad1TipoAtaqueJugador(movimientoUsado);  //Si solo posee un tipo
    } else {
      efectividad = this.obtenerEfectividad2TipoAtaqueJugador(movimientoUsado);  //Si posee dos tipos
    }

    // console.log("ataque:",  ataque)
    //  console.log("defensa: ",defensa)
    //  console.log("nivel:", nivel)
    //  console.log("bonif:",bonificacion)
    //  console.log("poder:",poder)
    //  console.log("variac:",variacion)
    //  console.log("efect:",efectividad)

    let precisionAtaque = movimientoUsado.precisión;
    let precisionObtenida = Math.floor(Math.random() * (100 - 1)) + 2;  //Un numero random de 1 a 100

    //Si es un movimiento de tipo Fisico o especial
    if (movimientoUsado.categoria != "Estado") {
      let daño = this.obtenerDañoAtaque(ataque, defensa, nivel, bonificacion, poder, variacion, efectividad);
      if (precisionObtenida <= precisionAtaque) {
        //alert("Daño: " + daño + ", precision: "+ precisionObtenida);
        return daño;
      } else {
        //this.toastr.error("Ha fallado el movimiento ", '');
        return null;
      }
    }

    //Si es un movimiento de estado
    else {
      if (precisionObtenida <= precisionAtaque) {
        this.realizaAtaqueEstadoJugador(movimientoUsado);
        return 0;  //Daño 0
      } else {
        //this.toastr.error("Ha fallado el movimiento ", '');
        return null;
      }
    }

  }


  atacaPokemonRival(movimientoUsado) {

    //Si el ataque es del mismo tipo que el Pokémon que lo lanza toma un valor de 1.5, si el ataque es de un tipo diferente al del Pokémon que lo lanza toma un valor de 1.
    let bonificacion = this.verificaTipoMovimientoIgualTipoPokemonRival(movimientoUsado);

    //Nivel del pokemon que ataca
    let nivel = this.niveles[this.nivel];

    //Cantidad de ataque o ataque especial del Pokémon rival, depende del tipo de movimeinto usado (fisico/especial)
    let ataque = 0;
    if (movimientoUsado.categoria == "Fisico") {
      ataque = this.actualPokemonRival.batalla.ataque;
    }
    if (movimientoUsado.categoria == "Especial") {
      ataque = this.actualPokemonRival.batalla['at.especial'];
    }

    //Poder del ataque, el potencial del ataque
    let poder = movimientoUsado.potencia;

    //Cantidad de defensa o defensa especial del Pokémon , depende del tipo de movimeinto usado (fisico/especial)
    let defensa = 0;
    if (movimientoUsado.categoria == "Fisico") {
      defensa = this.actualPokemon.batalla.defensa;
    }
    if (movimientoUsado.categoria == "Especial") {
      defensa = this.actualPokemon.batalla['def.especial'];
    }

    //Es una variable que comprende todos los valores discretos entre 85 y 100 (ambos incluidos).
    let variacion = Math.floor(Math.random() * (100 - 85)) + 86;  //Random 

    //Puede tomar los valores de 0, 0.25, 0.5, 1, 2 y 4
    let efectividad = 0;
    if (this.actualPokemon.tipo2 == null) {
      efectividad = this.obtenerEfectividad1TipoAtaqueRival(movimientoUsado);  //Si solo posee un tipo
    } else {
      efectividad = this.obtenerEfectividad2TipoAtaqueRival(movimientoUsado);  //Si posee dos tipos
    }
    // console.log("ataque:",  ataque)
    //  console.log("defensa: ",defensa)
    //  console.log("nivel:", nivel)
    //  console.log("bonif:",bonificacion)
    //  console.log("poder:",poder)
    //  console.log("variac:",variacion)
    //  console.log("efect:",efectividad)

    let precisionAtaque = movimientoUsado.precisión;
    let precisionObtenida = Math.floor(Math.random() * (100 - 1)) + 2;  //Un numero random de 1 a 100

    if (movimientoUsado.categoria != "Estado") {
      let daño = this.obtenerDañoAtaque(ataque, defensa, nivel, bonificacion, poder, variacion, efectividad);

      //Posibilidad de que un aatque sea golpe critico sera de 7%
      let golpeCritico = Math.floor(Math.random() * (100 - 1)) + 2;  //Un numero random de 1 a 100

      if (precisionObtenida <= precisionAtaque) { //Si el ataque no falla

        //Se calcula si hay golpe critico o no
        if (golpeCritico <= 7) {
          let adicional = daño * 0.5; // se suma 50% de daño , por ser critico
          this.toastr.warning("Golpe Critico!!! ", '');
          return daño + adicional;
        } else {
          return daño;
        }

      } else {
        return null;
      }
    } else {  //Ataque falla
      if (precisionObtenida <= precisionAtaque) {
        //alert("Ataque de estado : " + ", precision: " + precisionObtenida);
        return 0;
      } else {
        //this.toastr.error("Ha fallado el movimiento ",'Error') ;
        return null;
      }
    }
  }


  realizaAtaqueEstadoJugador(movimientoUsado) {

    //console.log(movimientoUsado.efecto)
    switch (movimientoUsado.efecto) {
      case "atacaPrimero": {
        //statements; 
        break;
      }
      case "bajaAtaque2": {
        this.actualPokemonRival.batalla.ataque = this.actualPokemonRival.ataque.defensa - 6;
        this.toastr.warning("Ha bajado mucho el ataque del rival!!! ", '');
        break;
      }
      case "bajaDefensa": {
        this.actualPokemonRival.batalla.defensa = this.actualPokemonRival.batalla.defensa - 3;
        this.toastr.warning("Ha bajado la defensa del rival!!! ", '');
        break;
      }
      case "bajaPrecision": {
        //Le reduce la precision a todos los movimientos del pokemon rival
        for (let index = 0; index < this.actualPokemonRival.movimientosBatalla.length; index++) {
          let move = this.actualPokemonRival.movimientosBatalla[index];
          move.precisión = move.precisión - 8;
        }
        this.toastr.warning("Ha bajado la precisión del rival!!! ", '');
        break;
      }
      case "bajaVelocidad": {
        this.actualPokemonRival.batalla.velocidad = this.actualPokemonRival.batalla.velocidad - 3;
        this.toastr.warning("Ha bajado la velocidad del rival!!! ", '');
        break;
      }
      case "duerme": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "envenena": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "envenenaPorTurno": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "esperaTurno": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "nuncaFalla": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "paraliza": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "puedeConfundir": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "puedeEnvenenar": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "puedeRepetirAtaque": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "puedeRetroceder": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "quema": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "recibeDaño": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "recuperaSalud": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "robaSalud": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "subeDefensa": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "subeVelocidad2": {
        //statements; 
        break;
      }
      case movimientoUsado.efecto == "vuela": {
        //statements; 
        break;
      }

      default: {
        return 0;
        break;
      }
    }
  }



  verificaTipoMovimientoIgualTipoPokemon(movimientoUsado) {
    if (movimientoUsado.tipo == this.actualPokemon.tipo1 || movimientoUsado.tipo == this.actualPokemon.tipo2) {
      return 1.5;
    } else {
      return 1;
    }
  }

  verificaTipoMovimientoIgualTipoPokemonRival(movimientoUsado) {
    if (movimientoUsado.tipo == this.actualPokemonRival.tipo1 || movimientoUsado.tipo == this.actualPokemonRival.tipo2) {
      return 1.5;
    } else {
      return 1;
    }
  }

  obtenerEfectividad1TipoAtaqueJugador(movimientoUsado) {
    let tipo = movimientoUsado.tipo;
    let tipoPokemon = this.actualPokemonRival.tipo1;

    for (let index = 0; index < this.tablaTipos.length; index++) {
      let tipoTabla = this.tablaTipos[index];
      if (tipoTabla.tipo == tipo) { //Si es el mismo tipo del ataque usado, se halla la efectividad del movimiento
        for (let j = 0; j < tipoTabla['atacando_A_tipo'].length; j++) {
          let tipoDefendiendo = tipoTabla['atacando_A_tipo'][j];
          let typ = Object.keys(tipoDefendiendo)[0];
          if (typ == tipoPokemon) {
            //console.log(tipoDefendiendo[typ]) //Efectividad de ataque , con solo un tipo
            return tipoDefendiendo[typ];
          }
        }
      }
    }
  }

  obtenerEfectividad2TipoAtaqueJugador(movimientoUsado) {
    let tipo = movimientoUsado.tipo;
    let tipo1Pokemon = this.actualPokemonRival.tipo1;
    let tipo2Pokemon = this.actualPokemonRival.tipo2;

    let efect1 = 0;
    let efect2 = 0;

    //Primero busca la efectividad del primer tipo
    for (let index = 0; index < this.tablaTipos.length; index++) {
      let tipoTabla = this.tablaTipos[index];
      if (tipoTabla.tipo == tipo) { //Si es el mismo tipo del ataque usado, se halla la efectividad del movimiento
        for (let j = 0; j < tipoTabla['atacando_A_tipo'].length; j++) {
          let tipoDefendiendo = tipoTabla['atacando_A_tipo'][j];
          let typ = Object.keys(tipoDefendiendo)[0];
          if (typ == tipo1Pokemon) {
            efect1 = tipoDefendiendo[typ];
          }
        }
      }
    }
    //Luego busca la efectividad del segundo tipo
    for (let index = 0; index < this.tablaTipos.length; index++) {
      let tipoTabla = this.tablaTipos[index];
      if (tipoTabla.tipo == tipo) { //Si es el mismo tipo del ataque usado, se halla la efectividad del movimiento
        for (let j = 0; j < tipoTabla['atacando_A_tipo'].length; j++) {
          let tipoDefendiendo = tipoTabla['atacando_A_tipo'][j];
          let typ = Object.keys(tipoDefendiendo)[0];
          if (typ == tipo2Pokemon) {
            efect2 = tipoDefendiendo[typ];
          }
        }
      }
    }
    let total = this.validarEfectividadAtaqueDobleTipo(efect1, efect2);
    console.log("Efect: ", total)
    return total;
  }

  obtenerEfectividad1TipoAtaqueRival(movimientoUsado) {
    //Falta obtener efectividad con base al segundo tipo del pokemon al que se ataca
    let tipo = movimientoUsado.tipo;
    let tipoPokemon = this.actualPokemon.tipo1;

    for (let index = 0; index < this.tablaTipos.length; index++) {
      let tipoTabla = this.tablaTipos[index];
      if (tipoTabla.tipo == tipo) { //Si es el mismo tipo del ataque usado, se halla la efectividad del movimiento
        for (let j = 0; j < tipoTabla['atacando_A_tipo'].length; j++) {
          let tipoDefendiendo = tipoTabla['atacando_A_tipo'][j];
          let typ = Object.keys(tipoDefendiendo)[0];
          if (typ == tipoPokemon) {
            return tipoDefendiendo[typ];
          }
        }
      }
    }
  }

  obtenerEfectividad2TipoAtaqueRival(movimientoUsado) {
    let tipo = movimientoUsado.tipo;
    let tipo1Pokemon = this.actualPokemon.tipo1;
    let tipo2Pokemon = this.actualPokemon.tipo2;

    let efect1 = 0;
    let efect2 = 0;

    //Primero busca la efectividad del primer tipo
    for (let index = 0; index < this.tablaTipos.length; index++) {
      let tipoTabla = this.tablaTipos[index];
      if (tipoTabla.tipo == tipo) { //Si es el mismo tipo del ataque usado, se halla la efectividad del movimiento
        for (let j = 0; j < tipoTabla['atacando_A_tipo'].length; j++) {
          let tipoDefendiendo = tipoTabla['atacando_A_tipo'][j];
          let typ = Object.keys(tipoDefendiendo)[0];
          if (typ == tipo1Pokemon) {
            efect1 = tipoDefendiendo[typ];
          }
        }
      }
    }
    //Luego busca la efectividad del segundo tipo
    for (let index = 0; index < this.tablaTipos.length; index++) {
      let tipoTabla = this.tablaTipos[index];
      if (tipoTabla.tipo == tipo) { //Si es el mismo tipo del ataque usado, se halla la efectividad del movimiento
        for (let j = 0; j < tipoTabla['atacando_A_tipo'].length; j++) {
          let tipoDefendiendo = tipoTabla['atacando_A_tipo'][j];
          let typ = Object.keys(tipoDefendiendo)[0];
          if (typ == tipo2Pokemon) {
            efect2 = tipoDefendiendo[typ];
          }
        }
      }
    }
    let total = this.validarEfectividadAtaqueDobleTipo(efect1, efect2);
    console.log("Efect: ", total)
    return total;
  } 


  validarEfectividadAtaqueDobleTipo(efect1, efect2) {

    if (efect1 == 0 || efect2 == 0) {
      return 0;
    }

    if (efect1 == 2 && efect2 == 2) {
      return 4;
    }
    if (efect1 == 1 && efect2 == 1) {
      return 1;
    }
    if (efect1 == 0.5 && efect2 == 0.5) {
      return 0.25;
    }

    if (efect1 == 1 && efect2 == 0.5) {
      return 0.5;
    }
    if (efect1 == 0.5 && efect2 == 1) {
      return 0.5;
    }

    if (efect1 ==1 && efect2 == 2) {
      return 2;
    }
    if (efect1 ==2 && efect2 == 1) {
      return 2;
    }

    if (efect1 ==2 && efect2 == 0.5) {
      return 1;
    }
    if (efect1 ==0.5 && efect2 == 2) {
      return 1;
    }
  }

  obtenerDañoAtaque(ataque, defensa, nivel, bonificacion, poder, variacion, efectividad) {
    let daño = 0;
    //Algoritmo para conseguir el daño de ataque ... https://pokemon.fandom.com/es/wiki/Da%C3%B1o
    let fact1 = 0.01 * bonificacion * efectividad * variacion;
    let fact2 = 0.2 * nivel + 1;
    let fact3 = fact2 * ataque * poder;
    let fact4 = 25 * defensa;
    let fact5 = fact3 / fact4;
    let fact6 = fact5 + 2;
    daño = fact1 * fact6;
    return Math.round(daño);
  }

  obtenerCantidadPokemonesVivosJugador() {
    let n = 0;
    for (let index = 0; index < this.equipoPokemon.length; index++) {
      let pokemon = this.equipoPokemon[index];
      if (pokemon.batalla.ps > 0) {
        n = n + 1;
      }
    }
    return n;
  }



}
