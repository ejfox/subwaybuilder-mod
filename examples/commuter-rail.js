/**
 * Example: Commuter Rail Train Type
 *
 * Adds a high-capacity regional rail for longer distances.
 * Great for connecting suburbs to city centers.
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
    // Register Commuter Rail
    api.trains.registerTrainType({
        id: 'commuter-rail',
        name: 'Commuter Rail',
        description: 'High-capacity regional rail for longer distances',
        stats: {
            // Performance (fast, high capacity)
            maxAcceleration: 0.8,       // m/s^2 (slower acceleration)
            maxDeceleration: 1.0,       // m/s^2
            maxSpeed: 40,               // m/s (~90 mph)
            maxSpeedLocalStation: 15,   // m/s

            // Capacity (large trains)
            capacityPerCar: 150,        // More than metro
            carLength: 25,              // meters (longer cars)
            minCars: 4,                 // Minimum 4 cars
            maxCars: 12,                // Up to 12 cars
            carsPerCarSet: 2,

            // Costs (expensive but high capacity)
            carCost: 3_000_000,         // $3M per car
            baseTrackCost: 40_000,      // $40k per meter
            baseStationCost: 60_000_000, // $60M per station
            trainOperationalCostPerHour: 600,
            carOperationalCostPerHour: 60,
            scissorsCrossoverCost: 20_000_000,

            // Dimensions
            trainWidth: 3.2,            // meters (wider)
            minStationLength: 200,      // Long platforms
            maxStationLength: 400,
        },
        compatibleTrackTypes: ['commuter-rail'],
        appearance: {
            color: '#8b5cf6',            // Purple
        },

        // Commuter rail is cheaper at grade and elevated
        // but very expensive for tunnels
        elevationMultipliers: {
            AT_GRADE: 0.7,              // 30% cheaper at grade
            ELEVATED: 0.8,              // 20% cheaper elevated
            CUT_AND_COVER: 1.3,         // 30% more expensive shallow tunnel
            STANDARD_TUNNEL: 1.5,       // 50% more expensive tunnel
            DEEP_BORE: 2.0,             // 100% more expensive deep bore
        },
    });

    console.log('[Commuter Rail Mod] Train type registered!');
});
