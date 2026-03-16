mapboxgl.accessToken =
  'pk.eyJ1IjoibWVyb253YiIsImEiOiJjbWt5eXZtZmIwZTRiM2RuM2NmMW51NTJsIn0.Ed7Mtil9vLyQb-7MMOBfiQ';

const RATE_FIELD = 'rate';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-98, 38],
  zoom: 3,
  minZoom: 2,
  projection: 'albers'
});

map.on('load', () => {
  map.addSource('covid-rates', {
  type: 'geojson',
  data: 'assets/us-covid-2020-rates.json'
});

map.addSource('covid-counts', {
  type: 'geojson',
  data: 'assets/us-covid-2020-counts.json'
});

    map.addLayer({
  id: 'cases-circles',
  type: 'circle',
  source: 'covid-counts',
  paint: {
    'fill-color': [
      'step',
      ['get', 'counts'],   
      '#f7fbff',     
      5,  '#c6dbef',    
      10, '#9ecae1',   
      20, '#6baed6',     
      40, '#3182bd',      
      80, '#08519c'      
    ],
    'fill-opacity': 0.85,
    'fill-outline-color': 'rgba(255,255,255,0.6)' ,
  }
});

    map.addLayer({
  id: 'cases-circles',
  type: 'circle',
  source: 'covid-counts',
  paint: {
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['get', 'cases'],
      100, 2,
      1000, 5,
      10000, 10,
      50000, 20,
      100000, 30
    ],
    'circle-color': '#d73027',
    'circle-opacity': 0.6,
    'circle-stroke-color': '#ffffff',
    'circle-stroke-width': 0.5
  }
});

map.on('click', 'cases-circles', (e) => {
  const p = e.features[0].properties;

  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(
      `<strong>${p.county}, ${p.state}</strong><br>
       Total cases: ${p.cases}`
    )
    .addTo(map);
});

map.on('mouseenter', 'cases-circles', () => {
  map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'cases-circles', () => {
  map.getCanvas().style.cursor = '';
});

    document.getElementById('legend').innerHTML = `
  <strong>Legend (circle size = cases)</strong><br>
  <div><span class="swatch" style="border-radius:50%; background: rgba(215,48,39,0.6); width:8px; height:8px;"></span> Small</div>
  <div><span class="swatch" style="border-radius:50%; background: rgba(215,48,39,0.6); width:14px; height:14px;"></span> Medium</div>
  <div><span class="swatch" style="border-radius:50%; background: rgba(215,48,39,0.6); width:20px; height:20px;"></span> Large</div>
  <div style="margin-top:8px;">Source: NYT (cases)</div>
`;
});
