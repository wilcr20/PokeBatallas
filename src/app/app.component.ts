import { Component } from '@angular/core';
import { ObtieneDatosService } from '../app/servicios/obtiene-datos.service';
import {BatallaService} from '../app/servicios/batalla.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  pokemons: any;
  movimientos: any;
  audio:any;
  suena= true;
  jugar1Player=false;
  selectValor=5;
  inicioPartida= true;
  muestraPokemonCambio= false;
  muestraAtaquesPokemon= false;
  menuBatalla= true;
  listaMovimientosActuales=[];
 

  audioOpening="http://23.237.126.42/ost/pokemon-gameboy-sound-collection/vvdpydwp/101-opening.mp3";

  constructor(private obtiene: ObtieneDatosService, private batalla:BatallaService) {

    this.audio = new Audio(this.audioOpening);
    this.audio.play()

    this.obtiene.getPokemons().subscribe(data => {
      this.pokemons = data;
      console.log(this.pokemons)
    });
    this.obtiene.getMovimientos().subscribe(data => {
      this.movimientos = data;
      console.log(this.movimientos)
    });
  }

  cambiarPokemon(){
    this.inicioPartida= false;
    this.muestraAtaquesPokemon= false;
    this.muestraPokemonCambio= true;
    this.menuBatalla= false;
    
  }

  cambiaPokemonActual(pokemon){  // Cambia el pokemon actual por otro elegido desde la vista
    this.batalla.actualPokemon= pokemon;
    this.suenaPokemon(pokemon.sonido)
    this.menuBatalla=true;
    this.inicioPartida=true;
    this.muestraPokemonCambio= false;
  }

  lucharPokemon(){
    this.listaMovimientosActuales= [];
    this.obtieneTiposMovimientos();
    this.inicioPartida= false;
    this.menuBatalla= false;
    this.muestraAtaquesPokemon= true;
    this.muestraPokemonCambio= false;
    console.log(this.listaMovimientosActuales)
  }

  obtieneTiposMovimientos(){
    let movimPokeActual = this.batalla.actualPokemon.movimientos[this.batalla.nivel].movimientos;
    for (let index = 0; index < movimPokeActual.length; index++) {
      let nombre = movimPokeActual[index].nombre;  
      let movimientoObjeto = this.obtenerMovimientoPorNombre(nombre);
      this.listaMovimientosActuales.push(movimientoObjeto)
    }
  }


  elegirNpokemonsRandoms(n){ //Recibe la cantidad de pokemons a uasr en batalla
    let tam= this.pokemons.length;
    this.batalla.equipoPokemon= []; 
    this.batalla.equipoRivalPokemon= [];
    let c=n-1;
    while( c>=0){
      let num1= Math.floor(Math.random() * tam+1);
      let num2= Math.floor(Math.random() * tam+1);
      this.batalla.equipoPokemon.push(this.pokemons[num1-1]);
      this.batalla.equipoRivalPokemon.push(this.pokemons[num2-1]);
      c=c-1;
    }
    
  }

  obtenerMovimientoPorNombre(nombre){
    for (let index = 0; index < this.movimientos.length; index++) {
      const element = this.movimientos[index];
      if(element.nombre == nombre){
        return element;
      }
    }
    return null;
  }

  //botones
  jugarPlayer(){
    this.elegirNpokemonsRandoms(this.selectValor);
    (<HTMLImageElement>document.getElementById("btnModal")).click();
    
    
  }

  setLevel(nivel){
    this.batalla.nivel= nivel;
  }

  setInicial(pokemon){
    this.audio.pause();
    this.batalla.actualPokemon=pokemon;
    this.jugar1Player= true;
  }

  //Sonidos

  detieneSonido(){
    let btn= (<HTMLImageElement>document.getElementById("sonido"));
    if(this.suena){
      this.audio.pause();
      btn.src= "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ0OC4wNzUgNDQ4LjA3NSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDQ4LjA3NSA0NDguMDc1OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+CjxwYXRoIGQ9Ik0zNTIuMDIxLDE2LjA3NWMwLTYuMDgtMy41Mi0xMS44NC04Ljk2LTE0LjRjLTUuNzYtMi44OC0xMi4xNi0xLjkyLTE2Ljk2LDEuOTJsLTE0MS43NiwxMTIuOTZsMTY3LjY4LDE2Ny42OFYxNi4wNzV6IiBmaWxsPSIjMDAwMDAwIi8+CjxwYXRoIGQ9Ik00NDMuMzQ5LDQyMC43NDdsLTQxNi00MTZjLTYuMjQtNi4yNC0xNi4zODQtNi4yNC0yMi42MjQsMHMtNi4yNCwxNi4zODQsMCwyMi42MjRsMTAwLjY3MiwxMDAuNzA0aC05LjM3NiAgYy05LjkyLDAtMTguNTYsNC40OC0yNC4zMiwxMS41MmMtNC44LDUuNDQtNy42OCwxMi44LTcuNjgsMjAuNDh2MTI4YzAsMTcuNiwxNC40LDMyLDMyLDMyaDc0LjI0bDE1NS44NCwxMjQuNDggIGMyLjg4LDIuMjQsNi40LDMuNTIsOS45MiwzLjUyYzIuMjQsMCw0LjgtMC42NCw3LjA0LTEuNmM1LjQ0LTIuNTYsOC45Ni04LjMyLDguOTYtMTQuNHYtNTcuMzc2bDY4LjY3Miw2OC42NzIgIGMzLjEzNiwzLjEzNiw3LjIzMiw0LjcwNCwxMS4zMjgsNC43MDRzOC4xOTItMS41NjgsMTEuMzI4LTQuNjcyQzQ0OS41ODksNDM3LjEzMSw0NDkuNTg5LDQyNy4wMTksNDQzLjM0OSw0MjAuNzQ3eiIgZmlsbD0iIzAwMDAwMCIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K"
      this.suena= false;
    }else{
      this.audio.play();
      btn.src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQwOCA0MDgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwOCA0MDg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0idm9sdW1lLW11dGUiPgoJCTxwYXRoIGQ9Ik04OS4yNSwxMjcuNXYxNTNoMTAyTDMxOC43NSw0MDhWMGwtMTI3LjUsMTI3LjVIODkuMjV6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==";
      this.suena= true;
    }  
  }


  suenaPokemon(music){
    let audio = new Audio(music);
    audio.play();
  }

  

}



