import { Feature, Geometry, GeoJSON, GeoJsonProperties } from './../../../node_modules/@types/geojson/index.d';
import { Component, AfterViewInit  } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {  OnInit } from '@angular/core';
import {Router} from '@angular/router'
import { InfiniteScrollCustomEvent } from '@ionic/angular';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})


export class TabsPage implements AfterViewInit, OnInit  {
  map!: mapboxgl.Map;
  public eventos:string[] =[];

  constructor(private router: Router) {}

  goTohome(){
    this.router.navigate(['home'])
  }

  //eventos
  ngOnInit() {
    this.generateItems();
  }

  private generateItems() {
    const count = this.eventos.length + 1;
    for (let i = 0; i < 50; i++) {
      this.eventos.push(`Evento ${count + i}`);
    }
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }


//MapaCampus
  ngAfterViewInit() {
    (mapboxgl as any).accessToken = 'pk.eyJ1Ijoia2F1YW55cmoxMyIsImEiOiJjbTNsdWR2c24wOWtlMnZwbHA5NWJqZmFmIn0.26TEMqrq5oOaUwB_99cVTg';

    // Inicializa o mapa
    this.map = new mapboxgl.Map({
      container: 'map', // ID do elemento no HTML
      style: 'mapbox://styles/mapbox/streets-v11', // Estilo básico
      center: [-49.05168645276804, -22.32998568430988], // Coordenadas da Unisagrado
      zoom: 18, // Nível de zoom
      pitch: 100, // Inclinação para visão 3D
      bearing: -20, // Rotação do mapa
      antialias: true, // Suavização para renderização 3D
    });

    // Adiciona controles de navegação (zoom e rotação)
    this.map.addControl(new mapboxgl.NavigationControl());

        // Adicionando um marcador para a UNISAGRADO
        new mapboxgl.Marker()
        .setLngLat([-49.05168645276804,-22.32998568430988]) // Coordenadas da UNISAGRADO
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Bloco J</h3><p>Auditórios, Cantina, Salas AudioVisuais.</p>'))
        .addTo(this.map);

        new mapboxgl.Marker()
        .setLngLat([-49.05126802816172,-22.331990376730676]) // Coordenadas da UNISAGRADO
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Bloco L</h3><p>Laboratórios das Engenharias</p>'))
        .addTo(this.map);




    // Renderiza os prédios em 3D
    this.map.on('load', () => {
      // Adiciona uma camada 3D
      this.map?.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        paint: {
          'fill-extrusion-color': '#ff0000', // Cor dos prédios
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            16.05,
            ['get', 'height'],
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            16.05,
            ['get', 'min_height'],
          ],
          'fill-extrusion-opacity': 0.8,
        },
      });
    });
  }






}
