//  Set Mapbox Access Token
mapboxgl.accessToken = 'pk.eyJ1IjoieGlleWl3ZTIiLCJhIjoiY201bzlrMzF4MGttMTJub20xODk5dGxydiJ9._U9znMhQu-2lUtT3MidkQg';

//  Initialize Map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/xieyiwe2/cm6zgcakx00rq01sbgd1ffmha',
    center: [-79.39, 43.66],
    zoom: 12 
});

//  Add Navigation & Fullscreen Controls
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

//  Add Geocoder (Search Bar)
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca"
});

// Ensure Geocoder is added only if the element exists
document.addEventListener("DOMContentLoaded", () => {
    const geocoderContainer = document.getElementById('geocoder');
    if (geocoderContainer) {
        geocoderContainer.appendChild(geocoder.onAdd(map));
    } else {
        console.error("❌ 'geocoder' element not found!");
    }
});

// Load Yoga Studio Data from GeoJSON
map.on('load', function () {
    map.addSource('yoga-studios', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/xieyiwe2/YIWEN_XIE_Lab2/refs/heads/main/yoga_map.geojson' 
    });

    //  Add Yoga Studio Layer
    map.addLayer({
        id: 'yoga-studios',
        type: 'circle',
        source: 'yoga-studios',
        paint: {
            'circle-radius': 6, 
            'circle-color': '#ff007f', 
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
        }
    });

    //  Add Pop-up when Clicking a Studio
    map.on('click', 'yoga-studios', (e) => {
        const properties = e.features[0].properties || {}; // Prevent undefined errors
        const name = properties.name || "Unknown Studio";
        const type = properties.type || "Not specified";
        const price = properties.price || "Unknown";

        new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML(`<strong>${name}</strong><br>🏋️ Yoga Type: ${type}<br>💰 Price: ${price}`)
            .addTo(map);
    });

    //  Change Cursor & Highlight Point on Hover
    map.on('mouseenter', 'yoga-studios', () => {
        map.getCanvas().style.cursor = 'pointer';
        map.setPaintProperty('yoga-studios', 'circle-radius', 10);
        map.setPaintProperty('yoga-studios', 'circle-opacity', 1);
    });

    map.on('mouseleave', 'yoga-studios', () => {
        map.getCanvas().style.cursor = '';
        map.setPaintProperty('yoga-studios', 'circle-radius', 6);
        map.setPaintProperty('yoga-studios', 'circle-opacity', 0.8);
    });

    //  Make Points Scale with Zoom
    map.on('zoom', () => {
        let zoomLevel = map.getZoom();
        map.setPaintProperty('yoga-studios', 'circle-radius', zoomLevel * 1.5);
    });

    //  Toggle Visibility of Yoga Layer
    document.getElementById('layercheck').addEventListener('change', (e) => {
        map.setLayoutProperty(
            'yoga-studios',
            'visibility',
            e.target.checked ? 'visible' : 'none'
        );
    });

    //  Button to Reset Map View
    document.getElementById('returnbutton').addEventListener('click', () => {
        map.flyTo({
            center: [-79.39, 43.66],
            zoom: 12,
            essential: true
        });
    });

    //  Show/Hide Legend
    document.getElementById('legendcheck').addEventListener('change', (e) => {
        const legend = document.getElementById('legend');
        legend.style.display = e.target.checked ? 'block' : 'none';
    });
});




