import { Component } from '@angular/core';
import { ObtieneDatosService } from '../app/servicios/obtiene-datos.service';
import { BatallaService } from '../app/servicios/batalla.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  pokemons = [];
  movimientos = [];
  listaMovimientosActuales = [];
  pokemonActualInfo: any;
  pokemonDatos = null;
  audio: any;
  
  //Variables booleanas para controlar vistas y funcionalidades
  suena = true;
  jugar1Player = false;
  inicioPartida = true;
  muestraPokemonCambio = false;
  muestraAtaquesPokemon = false;
  menuBatalla = true;
  pokedex = false;
  infoPokemon = false;
  datosMostrar = false;
  muestraBotonAtras= true;
  
  turnoJugador = true; //Siempre inicia jugador 
  temporizador = 20; //20 segundos por turno
  selectValor = 6;  //Cantidad de pokemones a usar por default


  audioOpening = "http://23.237.126.42/ost/pokemon-gameboy-sound-collection/vvdpydwp/101-opening.mp3";


  constructor(private obtiene: ObtieneDatosService, private batalla: BatallaService, private toastr: ToastrService) {

    // this.audio = new Audio(this.audioOpening);
    // this.audio.play()

    this.obtiene.getPokemons().subscribe(data => {
      this.pokemons = data;
      console.log(this.pokemons)
    });
    this.obtiene.getMovimientos().subscribe(data => {
      this.movimientos = data;
      console.log(this.movimientos)
    });
  }

  volverMenuPrincipal() {
    this.inicioPartida = false;
    this.pokedex = false;
    this.muestraAtaquesPokemon = false;
    this.muestraPokemonCambio = false;
    this.menuBatalla = true;
    this.jugar1Player = false;
    this.infoPokemon = false;
  }

  volverMenuBatalla() {
    this.inicioPartida = true;
    this.muestraAtaquesPokemon = false;
    this.muestraPokemonCambio = false;
    this.menuBatalla = true;
    (<HTMLImageElement>document.getElementById("sideMenu")).className = "sidenav";
  }


  //Metodos para realizar cambio de variables *******************************
  jugarPlayer() {
    this.elegirNpokemonsRandoms(this.selectValor);
    (<HTMLImageElement>document.getElementById("btnModal")).click();
  }

  verPokedex() {
    this.infoPokemon = false;
    this.pokedex = true;
  }

  verPokemon(pokemon) {
    this.pokemonActualInfo = pokemon;
    this.infoPokemon = true;
  }

  verDatoModal() {
    this.datosMostrar = false;
  }

  verDatos(pokemon) {
    this.datosMostrar = true;
    this.pokemonDatos = pokemon;
  }

  //******************************************************************** */



  //Metodo que realiza el cambio de turno del rival al jugador y viceversa
  cambiaTurno() {
    this.turnoJugador = !this.turnoJugador;
    setTimeout(() => {
      if (!this.turnoJugador) {
        this.toastr.warning("Turno del Rival", '');
        this.luchaMovimientoRival(); //llama metodo para que el rival realice un ataque
      }
    }, 1450);

  }

  //Muestra el menu para cambiar pokemons en batalla 
  cambiarPokemon() {
    let cant = this.batalla.obtenerCantidadPokemonesVivosJugador();
    if (cant > 0) {
      this.inicioPartida = false;
      this.muestraAtaquesPokemon = false;
      this.muestraPokemonCambio = true;
      this.menuBatalla = false;
      if (this.batalla.equipoPokemon.length <= 3) {
        (<HTMLImageElement>document.getElementById("sideMenu")).className = "sidenavcambiaPokemon1";
      } else {
        (<HTMLImageElement>document.getElementById("sideMenu")).className = "sidenavcambiaPokemon2";
      }
    } else {
      this.toastr.error("Ya no dispones de pokemones. Has perdido :'v", 'GG');
      this.turnoJugador = true;
      this.volverMenuPrincipal();
    }


  }

  cambiaPokemonRival() {
    setTimeout(() => {
      for (let index = 0; index < this.batalla.equipoRivalPokemon.length; index++) {
        let pokemon = this.batalla.equipoRivalPokemon[index];
        if (pokemon.batalla.ps > 0) {
          this.batalla.actualPokemonRival = pokemon; //Cambia al siguiente pokemon en lista
          this.suenaPokemon(pokemon.sonido);
          return;
        }
      }
      this.toastr.error("Rival ya no dispone de pokemones. Has Ganado", '');
      this.turnoJugador = true;
      this.volverMenuPrincipal();
    }, 2000);

  }

  cambiaPokemonActual(pokemon) {  // Cambia el pokemon actual por otro elegido desde la vista
    if (pokemon == this.batalla.actualPokemon) {
      this.toastr.error("Este pokemon ya se encuentra en batalla. Seleccione otro", '');
    } else {
      if(pokemon.batalla.ps >0){ //Si el pokemon elegido tiene ps aun
        this.batalla.actualPokemon = pokemon;
        this.suenaPokemon(pokemon.sonido)
        this.cambiaTurno();
        this.muestraBotonAtras= true;
        this.volverMenuBatalla();
        return;
      }else{
        this.toastr.error("Este pokemon no dispone PS para luchar. Seleccione otro", '');
      }

      
    }
  }


  //Muestra el menu para cambiar pokemons en batalla 
  lucharPokemon() {
    this.listaMovimientosActuales = [];
    this.inicioPartida = false;
    this.menuBatalla = false;
    this.muestraAtaquesPokemon = true;
    this.muestraPokemonCambio = false;
    (<HTMLImageElement>document.getElementById("sideMenu")).className = "sidenavLuchaPokemon";
  }

  //Al presionar el ataque a utilizar en el pokemon actual
  luchaMovimiento(pokemonMov) {
    for (let index = 0; index < this.batalla.actualPokemon.movimientosBatalla.length; index++) {
      let mov = this.batalla.actualPokemon.movimientosBatalla[index];
      if (mov.nombre == pokemonMov) {
        if (mov.pp == 0) { //Verifica si el movimiento usado dispone de PP para utilizarse
          (<HTMLInputElement>document.getElementById(mov.nombre)).disabled = true;
          (<HTMLInputElement>document.getElementById(mov.nombre)).classList.add('disabled');
          return;
        }
        mov.pp = mov.pp - 1;

        //Barra de vida del rival
        let barraVida = (<HTMLInputElement>document.getElementById("psPokemonRival"));

        //Llama el metodo para obtener el daño del amovimiento usado
        let daño = this.batalla.atacaPokemon(mov);
        if(daño == null){
          this.toastr.error(this.batalla.actualPokemon.nombre + " ha usado " + mov.nombre+ ",pero ha fallado", '');
        }else{
          this.toastr.success(this.batalla.actualPokemon.nombre + " ha usado " + mov.nombre, '');
        }
        

        let vidaActualRival = this.batalla.actualPokemonRival.batalla.ps;
        let newVida = vidaActualRival - daño;//Nueva vida obtenida del rival despues del daño recibido
        
        setTimeout(() => {
          if (newVida <= 0) {
            barraVida.value = "0";
            this.toastr.success("Pokemon rival Debilitado", '');
            this.setVidaRival(0) //Llama metodo de setear vida Rival
            setTimeout(() => {
              this.cambiaPokemonRival();
              this.volverMenuBatalla();
              this.cambiaTurno();
            }, 800);
            return;
          }
          if (newVida > 0) {
            while (vidaActualRival > newVida) {  //Realiza el efecto de disminuir la barra de vida de maner agradula
              (function (vidaActualRival) {
                setTimeout(function () {
                  barraVida.setAttribute("value", vidaActualRival.toString());
                }, 400)
              })
                (vidaActualRival = vidaActualRival - 1)
            }
            this.setVidaRival(newVida) //Llama metodo de setear vida Rival
            this.volverMenuBatalla();
            this.cambiaTurno();
          }
          this.volverMenuBatalla(); //Termina ataque
          return;
        }, 1200);

      }
    }
  }


  //Metodo a ejecutar cuando el rival va  atacar
  luchaMovimientoRival() {
    setTimeout(() => {
      let movimiento = this.batalla.eligeAtaqueRival(); //Llama a metodo del servicio
      this.atacaPokemoRival(movimiento);
    }, 1900);

  }

  atacaPokemoRival(movimiento) {
    //Barra de vida del pokemon actual
    let barraVidaJugador = (<HTMLInputElement>document.getElementById("psPokemon"));

    //Llama el metodo para obtener el daño del a¿movimiento usado
    let daño = this.batalla.atacaPokemonRival(movimiento);
    this.toastr.success(this.batalla.actualPokemonRival.nombre + " ha usado " + movimiento.nombre, '');

    let vidaActual = this.batalla.actualPokemon.batalla.ps;
    let newVida = vidaActual - daño;//Nueva vida obtenida del rival despues del daño recibido


    setTimeout(() => {
      if (newVida <= 0) {
        barraVidaJugador.value = "0";
        this.toastr.error("Pokemon jugador Debilitado", 'Error');
        this.setVidaJugador(0) //Llama metodo de setear vida Rival
        setTimeout(() => {
          this.cambiaTurno();
          this.muestraBotonAtras= false;
          this.cambiarPokemon();
          return;
        }, 800);
        return;
      }
      if (newVida > 0) {
        while (vidaActual > newVida) {  //Realiza el efecto de disminuir la barra de vida de maner agradula
          (function (vidaActual) {
            setTimeout(function () {
              barraVidaJugador.setAttribute("value", vidaActual.toString());
            }, 400)
          })
            (vidaActual = vidaActual - 1)
        }
        this.setVidaJugador(newVida) //Llama metodo de setear vida Rival
        this.cambiaTurno();
      }
    }, 1400);
  }



  setVidaRival(vida) {
    setTimeout(() => {
      this.batalla.actualPokemonRival.batalla.ps = vida;
    }, 500);
  }

  setVidaJugador(vida) {
    setTimeout(() => {
      this.batalla.actualPokemon.batalla.ps = vida;
    }, 500);
  }


  //Metodo retorna lista con los tipos de los movimeintos del pokemon actual : ["agua", "fuego",...]
  obtieneTiposMovimientos() {
    let movimPokeActual = this.batalla.actualPokemon.movimientos[this.batalla.nivel].movimientos;
    for (let index = 0; index < movimPokeActual.length; index++) {
      let nombre = movimPokeActual[index].nombre;
      let movimientoObjeto = this.obtenerMovimientoPorNombre(nombre);
      this.listaMovimientosActuales.push(movimientoObjeto)
    }
  }

  //Metodo verifica que el pokemon aun tiene PP para batallar en todos sus movimientos!!!
  verificaAtaquesPP() {
    //Por terminar, muy poco probable que el pokemon quede sin PP´s en batalla
  }


  elegirNpokemonsRandoms(n) { //Recibe la cantidad de pokemons a usar en batalla
    let tam = this.pokemons.length;
    this.batalla.equipoPokemon = [];
    this.batalla.equipoRivalPokemon = [];
    let c = n - 1;
    while (c >= 0) {
      let num1 = Math.floor(Math.random() * tam + 1);
      let num2 = Math.floor(Math.random() * tam + 1);
      let agregar1 = this.verificaPokemonRepetido(this.pokemons[num1 - 1], this.batalla.equipoPokemon);
      let agregar2 = this.verificaPokemonRepetido(this.pokemons[num2 - 1], this.batalla.equipoRivalPokemon);
      if (!agregar1 && !agregar2) {
        this.batalla.equipoPokemon.push(this.pokemons[num1 - 1]);
        this.batalla.equipoRivalPokemon.push(this.pokemons[num2 - 1]);
        c = c - 1;
      }
    }
  }

  //Metodo para evitar pokemon repetido en equipo
  verificaPokemonRepetido(pokemon, lista) {
    if (lista.length == 0) { //No hay pokemons en equipo aun
      return false;
    }
    //Si hay al menos un pokemon ya agregado en el equipo
    for (let index = 0; index < lista.length; index++) {
      let pk = lista[index];
      if (pk == pokemon) { // Si haya al pokemon ya agregado en lista
        return true;
      }
    }
    return false;
  }

  //dado el nombre, retorna el objeto movimiento
  obtenerMovimientoPorNombre(nombre) {
    for (let index = 0; index < this.movimientos.length; index++) {
      const element = this.movimientos[index];
      if (element.nombre == nombre) {
        return element;
      }
    }
    return null;
  }


  setLevel(nivel) {
    this.batalla.nivel = nivel;
  }

  //Este metodo se ejecuta al iniicar el juego
  setInicial(pokemon) {
    //this.audio.pause();
    this.batalla.actualPokemon = pokemon;
    this.batalla.actualPokemonRival = this.batalla.equipoRivalPokemon[0];
    this.jugar1Player = true;
    this.inicioPartida = true;
    this.batalla.setearStatsPokemons();
    this.batalla.setearStatsPokemonsRival();


    this.obtieneTiposMovimientos();
    this.setearMovimientosPokemons()
    this.setearMovimientosPokemonsRival()
    this.suenaPokemon(pokemon.sonido);
    this.suenaPokemon(this.batalla.equipoRivalPokemon[0].sonido);

  }

  setearMovimientosPokemons() {
    for (let index = 0; index < this.batalla.equipoPokemon.length; index++) {
      let pokemon = this.batalla.equipoPokemon[index];
      for (let j = 0; j < pokemon.movimientos[this.batalla.nivel].movimientos.length; j++) {
        let nombreMov = pokemon.movimientos[this.batalla.nivel].movimientos[j].nombre
        let movimiento = this.obtenerMovimientoPorNombre(nombreMov);
        pokemon.movimientosBatalla[j] = movimiento;
      }
    }
    console.log("Equipo: ", this.batalla.equipoPokemon)
  }

  setearMovimientosPokemonsRival() {
    for (let index = 0; index < this.batalla.equipoRivalPokemon.length; index++) {
      let pokemon = this.batalla.equipoRivalPokemon[index];
      for (let j = 0; j < pokemon.movimientos[this.batalla.nivel].movimientos.length; j++) {
        let nombreMov = pokemon.movimientos[this.batalla.nivel].movimientos[j].nombre
        let movimiento = this.obtenerMovimientoPorNombre(nombreMov);
        pokemon.movimientosBatalla[j] = movimiento;
      }
    }
    console.log("Equipo Rival: ", this.batalla.equipoRivalPokemon)
  }



  //Sonidos

  detieneSonido() {
    let btn = (<HTMLImageElement>document.getElementById("sonido"));
    if (this.suena) {
      this.audio.pause();
      btn.src = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ0OC4wNzUgNDQ4LjA3NSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDQ4LjA3NSA0NDguMDc1OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+CjxwYXRoIGQ9Ik0zNTIuMDIxLDE2LjA3NWMwLTYuMDgtMy41Mi0xMS44NC04Ljk2LTE0LjRjLTUuNzYtMi44OC0xMi4xNi0xLjkyLTE2Ljk2LDEuOTJsLTE0MS43NiwxMTIuOTZsMTY3LjY4LDE2Ny42OFYxNi4wNzV6IiBmaWxsPSIjMDAwMDAwIi8+CjxwYXRoIGQ9Ik00NDMuMzQ5LDQyMC43NDdsLTQxNi00MTZjLTYuMjQtNi4yNC0xNi4zODQtNi4yNC0yMi42MjQsMHMtNi4yNCwxNi4zODQsMCwyMi42MjRsMTAwLjY3MiwxMDAuNzA0aC05LjM3NiAgYy05LjkyLDAtMTguNTYsNC40OC0yNC4zMiwxMS41MmMtNC44LDUuNDQtNy42OCwxMi44LTcuNjgsMjAuNDh2MTI4YzAsMTcuNiwxNC40LDMyLDMyLDMyaDc0LjI0bDE1NS44NCwxMjQuNDggIGMyLjg4LDIuMjQsNi40LDMuNTIsOS45MiwzLjUyYzIuMjQsMCw0LjgtMC42NCw3LjA0LTEuNmM1LjQ0LTIuNTYsOC45Ni04LjMyLDguOTYtMTQuNHYtNTcuMzc2bDY4LjY3Miw2OC42NzIgIGMzLjEzNiwzLjEzNiw3LjIzMiw0LjcwNCwxMS4zMjgsNC43MDRzOC4xOTItMS41NjgsMTEuMzI4LTQuNjcyQzQ0OS41ODksNDM3LjEzMSw0NDkuNTg5LDQyNy4wMTksNDQzLjM0OSw0MjAuNzQ3eiIgZmlsbD0iIzAwMDAwMCIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K"
      this.suena = false;
    } else {
      this.audio.play();
      btn.src = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQwOCA0MDgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwOCA0MDg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0idm9sdW1lLW11dGUiPgoJCTxwYXRoIGQ9Ik04OS4yNSwxMjcuNXYxNTNoMTAyTDMxOC43NSw0MDhWMGwtMTI3LjUsMTI3LjVIODkuMjV6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==";
      this.suena = true;
    }
  }

  //Metodo recibe una url y reproduce sonido
  suenaPokemon(music) {
    let audio = new Audio(music);
    audio.play();
  }
  //etodo reproduce sonido de click
  suenaClick() {
    let audio = new Audio("http://www.cicorp.com/music/Microsoft/Office97/Utopia%20Close.WAV");
    audio.play();
  }




}



