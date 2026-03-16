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

    map.addLayer({
  id: 'covid-rates-fill',
  type: 'fill',
  source: 'covid-rates',
  paint: {
    'fill-color': [
      'step',
      ['get', 'rates'],   
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
    id: 'rates-outline',
    type: 'line',
    source: 'covid_rates',
    paint: {
      'line-color': 'rgba(255,255,255,0.25)',
      'line-width': 0.5
    }
  });

  map.on('click', 'covid-rates-fill', (e) => {
  const p = e.features[0].properties;

  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(
      `<strong>${p.county}, ${p.state}</strong><br>
       Rate: ${p.rates} cases per 1,000`
    )
    .addTo(map);
});

  map.on('mouseenter', 'covid-rates-fill', () => (map.getCanvas().style.cursor = 'pointer'));
  map.on('mouseleave', 'covid-rates-fill', () => (map.getCanvas().style.cursor = ''));

  document.getElementById('legend').innerHTML = `
    <strong>Cases per 1,000</strong><br>
    <span class="swatch" style="background:#f7fbff"></span> &lt; 5<br>
    <span class="swatch" style="background:#deebf7"></span> 5–10<br>
    <span class="swatch" style="background:#c6dbef"></span> 10–20<br>
    <span class="swatch" style="background:#6baed6"></span> 20–40<br>
    <span class="swatch" style="background:#2171b5"></span> 40–80<br>
    <span class="swatch" style="background:#08306b"></span> ≥ 80<br>
    <p style="text-align:right;font-size:10pt;">Source: NYT + ACS 2018</p>
  `;
});
