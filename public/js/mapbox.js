/* eslint-disable */
export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY2FvbG9uZzI1MDMiLCJhIjoiY20xcW5kNGJsMDF3cDJsb2VzMjR1dXdwNCJ9.cHPFUD4MTkvgYZAduBwdDQ';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/caolong2503/cm1qp3a90010j01qp4s51hq9r',
    scrollZoom: false
    // style: 'mapbox://styles/caolong2503/cm1qpnb2s00tj01qta41i8r2w'
    // zoom: 10
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);

    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
      }
    });
  });
};
