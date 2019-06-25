import { Component } from '@angular/core';
import { ObtieneDatosService } from '../app/servicios/obtiene-datos.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PokeBatallas';

  pokemons: any;
  movimientos: any;

  constructor(private obtiene: ObtieneDatosService) {
    this.obtiene.getPokemons().subscribe(data => {
      this.pokemons = data;
      console.log(this.pokemons)
    });
    this.obtiene.getMovimientos().subscribe(data => {
      this.movimientos = data;
      console.log(this.movimientos)
    });
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

}



