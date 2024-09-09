maptilersdk.config.apiKey = maptilerApiKey;
const map = new maptilersdk.Map({
  container: "map", // container's id or the HTML element in which the SDK will render the map
  style: maptilersdk.MapStyle.STREETS,
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 14, // starting zoom
  scaleControl: true,
});
new maptilersdk.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(
      `<h3>${campgrounds.title}</h3><p>${campgrounds.location}</p>`
    )
  )
  .addTo(map);
