import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class ObtieneDatosService {

  constructor(private http: HttpClient) {
    // this.getPokemons().subscribe(data => {
    //     console.log(data);
    // });
  }

  public getPokemons(): Observable<any> {
    return this.http.get("./assets/Datos/pokemons.json");
  }

  public getMovimientos(): Observable<any> {
    return this.http.get("./assets/Datos/movimientos.json");
  }

  public getEfectividades(): Observable<any> {
    return this.http.get("./assets/Datos/efectividades.json");
  }
}
