/**
 * Example: Adding a Custom City
 *
 * This example shows how to add Montreal to Subway Builder.
 * Replace the coordinates with your own city!
 */

function whenAPIReady(callback) {
    if (window.SubwayBuilderAPI) {
        callback(window.SubwayBuilderAPI);
    } else {
        const interval = setInterval(() => {
            if (window.SubwayBuilderAPI) {
                clearInterval(interval);
                callback(window.SubwayBuilderAPI);
            }
        }, 100);
    }
}

whenAPIReady((api) => {
    // Register Montreal
    api.registerCity({
        name: 'Montreal',
        code: 'MTL',
        description: 'Build metros beneath the Underground City',
        population: 4_300_000,
        initialViewState: {
            zoom: 13.5,
            latitude: 45.5017,
            longitude: -73.5673,
            bearing: 0
        },
        minZoom: 10,

        // Optional: Custom thumbnail for city select
        // You'll need to serve this from a local server
        // mapImageUrl: 'http://127.0.0.1:8080/MTL/thumbnail.svg',
    });

    // Optional: Hide certain layers by default for this city
    api.map.setDefaultLayerVisibility('MTL', {
        buildingFoundations: false,
        oceanFoundations: false,
    });

    // Log when Montreal loads
    api.hooks.onCityLoad((cityCode) => {
        if (cityCode === 'MTL') {
            console.log('Welcome to Montreal!');
            api.ui.showNotification('Bienvenue à Montréal!', 'success');
        }
    });

    console.log('[Montreal Mod] City registered!');
});
