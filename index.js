/**
 * Subway Builder Mod Template
 *
 * This is your mod's entry point. Uncomment the sections you need!
 *
 * The API is available at: window.SubwayBuilderAPI
 * See README.md for full documentation.
 */

// ============================================================================
// HELPER: Wait for API to be ready
// ============================================================================

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

// ============================================================================
// YOUR MOD CODE STARTS HERE
// ============================================================================

whenAPIReady((api) => {
    console.log('[My Mod] Loaded! API version:', api.version);

    // ========================================================================
    // EXAMPLE 1: Register a Custom City
    // ========================================================================
    // Uncomment to add a new city to the game

    /*
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

        // Optional: Custom thumbnail URL
        // mapImageUrl: 'http://127.0.0.1:8080/MTL/thumbnail.svg',
    });

    console.log('[My Mod] Registered Montreal!');
    */

    // ========================================================================
    // EXAMPLE 2: Register a Tram/Streetcar Train Type
    // ========================================================================
    // Uncomment to add a new train type

    /*
    api.trains.registerTrainType({
        id: 'tram',
        name: 'Streetcar',
        description: 'Light rail for street running',
        stats: {
            maxAcceleration: 1.2,
            maxDeceleration: 1.5,
            maxSpeed: 15,               // m/s (~34 mph)
            maxSpeedLocalStation: 12,
            capacityPerCar: 80,
            carLength: 20,
            minCars: 1,
            maxCars: 3,
            carsPerCarSet: 1,
            carCost: 500_000,
            trainWidth: 2.4,
            minStationLength: 40,
            maxStationLength: 80,
            baseTrackCost: 15_000,      // Cheaper than metro
            baseStationCost: 5_000_000,
            trainOperationalCostPerHour: 100,
            carOperationalCostPerHour: 20,
            scissorsCrossoverCost: 1_000_000,
        },
        compatibleTrackTypes: ['tram'],
        appearance: {
            color: '#f59e0b',           // Amber color
        },

        // TRAM-SPECIFIC: Allow crossing roads at street level
        allowAtGradeRoadCrossing: true,

        // TRAM-SPECIFIC: Custom elevation cost multipliers
        elevationMultipliers: {
            AT_GRADE: 0.5,              // Cheaper at street level
            ELEVATED: 1.8,              // More expensive elevated
            CUT_AND_COVER: 1.2,         // Slightly more expensive shallow tunnel
            // DEEP_BORE and STANDARD_TUNNEL use global defaults
        },
    });

    console.log('[My Mod] Registered Tram train type!');
    */

    // ========================================================================
    // EXAMPLE 3: Modify Game Constants
    // ========================================================================
    // Uncomment to tweak game balance

    /*
    api.modifyConstants({
        STARTING_MONEY: 10_000_000_000,     // 10B instead of 3B
        DEFAULT_TICKET_COST: 5,              // $5 tickets
        CONSTRUCTION_COSTS: {
            TUNNEL: {
                SINGLE_MULTIPLIER: 0.5       // Half tunnel cost
            }
        }
    });

    console.log('[My Mod] Modified game constants!');
    */

    // ========================================================================
    // EXAMPLE 4: Modify Existing Train Type
    // ========================================================================
    // Uncomment to tweak existing trains

    /*
    api.trains.modifyTrainType('heavy-metro', {
        stats: {
            maxSpeed: 30,                    // Faster top speed
            carCost: 2_000_000,              // Cheaper cars
        },
        appearance: {
            color: '#ef4444',                // Red instead of blue
        },
    });

    console.log('[My Mod] Modified heavy metro!');
    */

    // ========================================================================
    // EXAMPLE 5: Set Default Layer Visibility (for custom cities)
    // ========================================================================
    // Uncomment to hide layers by default for your city

    /*
    api.map.setDefaultLayerVisibility('MTL', {
        buildingFoundations: false,          // Hide building layer
        oceanFoundations: false,             // Hide ocean layer
        trackElevations: true,               // Keep elevation visible
    });

    console.log('[My Mod] Set layer defaults for Montreal!');
    */

    // ========================================================================
    // EXAMPLE 6: Add Custom Map Layers
    // ========================================================================
    // Uncomment to add custom tile sources or layers

    /*
    // Add a tile source
    api.map.registerSource('custom-tiles', {
        type: 'raster',
        tiles: ['https://tile.server.com/{z}/{x}/{y}.png'],
        tileSize: 256
    });

    // Add a map layer
    api.map.registerLayer({
        id: 'custom-layer',
        type: 'fill',
        source: 'custom-tiles',
        paint: {
            'fill-color': '#088',
            'fill-opacity': 0.5
        }
    });

    console.log('[My Mod] Added custom map layers!');
    */

    // ========================================================================
    // EXAMPLE 7: Lifecycle Hooks
    // ========================================================================
    // Uncomment to respond to game events

    /*
    api.hooks.onCityLoad((cityCode) => {
        console.log(`[My Mod] City loaded: ${cityCode}`);

        if (cityCode === 'MTL') {
            // Do Montreal-specific initialization
        }
    });

    api.hooks.onDayChange((day) => {
        if (day % 100 === 0) {
            api.ui.showNotification(`Milestone: Day ${day}!`, 'success');
        }
    });

    api.hooks.onMapReady((map) => {
        console.log('[My Mod] Map ready!', map);
        // Access raw MapLibre GL instance here
    });
    */

    // ========================================================================
    // EXAMPLE 8: Read Game State
    // ========================================================================
    // Uncomment to access current game data

    /*
    api.hooks.onCityLoad(() => {
        // Get game data
        const stations = api.gameState.getStations();
        const routes = api.gameState.getRoutes();
        const tracks = api.gameState.getTracks();
        const budget = api.gameState.getBudget();
        const day = api.gameState.getCurrentDay();

        console.log(`[My Mod] Day ${day}: ${stations.length} stations, $${budget.toLocaleString()}`);

        // Get demand data
        const demandData = api.gameState.getDemandData();
        if (demandData) {
            console.log(`[My Mod] Demand points: ${demandData.points.size}`);
            console.log(`[My Mod] Population groups: ${demandData.popsMap.size}`);
        }

        // Calculate blueprint cost
        const blueprintTracks = tracks.filter(t => t.displayType === 'blueprint');
        if (blueprintTracks.length > 0) {
            const cost = api.gameState.calculateBlueprintCost(blueprintTracks);
            console.log(`[My Mod] Blueprint cost: $${cost.totalCost.toLocaleString()}`);
        }
    });
    */

    // ========================================================================
    // EXAMPLE 9: Add Custom UI Components
    // ========================================================================
    // Uncomment to add UI to the game (requires React)

    /*
    // Only works if React is available in the global scope
    if (window.React) {
        const MyModMenu = () => {
            return window.React.createElement('div',
                { className: 'p-4 bg-white dark:bg-gray-800 rounded' },
                window.React.createElement('h3', null, 'My Mod Settings'),
                window.React.createElement('button',
                    { onClick: () => console.log('Clicked!') },
                    'Do Something'
                )
            );
        };

        api.ui.registerComponent('settings-menu', {
            id: 'my-mod-settings',
            component: MyModMenu
        });
    }
    */

    // ========================================================================
    // EXAMPLE 10: Add Custom Newspapers
    // ========================================================================
    // Uncomment to add custom newspaper articles

    /*
    api.registerNewspaperTemplates([{
        headline: 'Montreal Metro Reaches {{STATIONS}} Stations!',
        content: 'The STM celebrated today as the metro network expanded to {{STATIONS}} stations...',
        metadata: {
            category: 'milestone',
            tone: 'celebratory',
            requiredGameState: {
                minStations: 10
            },
            weight: 8
        }
    }]);

    console.log('[My Mod] Added newspaper templates!');
    */

    // ========================================================================
    // EXAMPLE 11: Validate Data with Schemas
    // ========================================================================
    // Uncomment to validate your custom city data

    /*
    const myDemandData = {
        points: [
            { id: 'dp_001', location: [-73.5673, 45.5017], jobs: 500, residents: 1200, popIds: ['pop_001'] }
        ],
        pops: [
            { id: 'pop_001', size: 100, residenceId: 'dp_001', jobId: 'dp_002', drivingSeconds: 1800, drivingDistance: 15000 }
        ]
    };

    const result = api.schemas.DemandDataSchema.safeParse(myDemandData);
    if (result.success) {
        console.log('[My Mod] Demand data is valid!');
    } else {
        console.error('[My Mod] Validation errors:', result.error.errors);
    }
    */

});
