/**
 * Example: Tram/Streetcar Mod
 *
 * Adds a tram train type that can run on streets,
 * has lower costs at grade, and higher costs elevated.
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
    // Register the Tram train type
    api.trains.registerTrainType({
        id: 'tram',
        name: 'Streetcar',
        description: 'Light rail for street running - perfect for mixed traffic',
        stats: {
            // Performance (slower than metro, designed for streets)
            maxAcceleration: 1.2,      // m/s^2
            maxDeceleration: 1.5,      // m/s^2
            maxSpeed: 15,              // m/s (~34 mph)
            maxSpeedLocalStation: 12,  // m/s

            // Capacity (smaller vehicles)
            capacityPerCar: 80,
            carLength: 20,             // meters
            minCars: 1,
            maxCars: 3,
            carsPerCarSet: 1,

            // Costs (much cheaper than metro)
            carCost: 500_000,          // $500k per car
            baseTrackCost: 15_000,     // $15k per meter (vs ~$35k for metro)
            baseStationCost: 5_000_000, // $5M per station (vs ~$50M for metro)
            trainOperationalCostPerHour: 100,
            carOperationalCostPerHour: 20,
            scissorsCrossoverCost: 1_000_000,

            // Dimensions
            trainWidth: 2.4,           // meters (narrower than metro)
            minStationLength: 40,
            maxStationLength: 80,
        },
        compatibleTrackTypes: ['tram'],
        appearance: {
            color: '#f59e0b',          // Amber/orange
        },

        // TRAM-SPECIFIC FEATURES:

        // 1. Allow crossing roads at street level
        // (Normal metros get blocked by road collision)
        allowAtGradeRoadCrossing: true,

        // 2. Custom elevation cost multipliers
        // Trams are designed for streets, so they're cheaper at grade
        // but more expensive to elevate or tunnel
        elevationMultipliers: {
            AT_GRADE: 0.5,             // 50% cheaper at street level
            ELEVATED: 1.8,             // 80% more expensive elevated
            CUT_AND_COVER: 1.2,        // 20% more expensive shallow tunnel
            STANDARD_TUNNEL: 1.5,      // 50% more expensive deep tunnel
            // DEEP_BORE uses global default
        },
    });

    // Show confirmation
    console.log('[Tram Mod] Streetcar train type registered!');

    // Optional: Show notification when game loads
    api.hooks.onGameInit(() => {
        api.ui.showNotification('Tram mod loaded - check train types!', 'info');
    });
});
