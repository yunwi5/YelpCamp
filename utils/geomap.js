const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN || 'pk.eyJ1IjoieXVud2k1IiwiYSI6ImNsMGc5em94MDEwcGkzY3BicndmY3B5dzYifQ.VMTOhwVs-KOgoGZE3ZeSJQ';
// console.log('mapboxToken:', process.env.MAPBOX_TOKEN);

const geocoder = mbxGeocoding({ accessToken: mapboxToken });

async function getGeoData(location) {
    const geoData = await geocoder.forwardGeocode({
        query: location,
        limit: 1
    }).send();

    return geoData.body.features[0].geometry;
}

module.exports = {
    getGeoData
}
