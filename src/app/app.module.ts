import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';    
import { ToastrModule } from 'ngx-toastr';  

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,  
    ToastrModule.forRoot(
      {  
        positionClass:"toast-top-center",  
        closeButton: true,   
        timeOut: 1400,
        preventDuplicates: true
      } 
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
