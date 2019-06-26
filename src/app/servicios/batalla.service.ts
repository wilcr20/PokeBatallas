import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BatallaService {

  actualPokemon=null;
  equipoPokemon=[];
  equipoRivalPokemon=[];
  nivel=0;

  //Todos los datos a usar se guardarán en este servicio

  constructor() { }
}
