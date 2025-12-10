/**
 * Example: Game Balance Tweaks
 *
 * This example shows how to modify game constants
 * for a different gameplay experience.
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
    // =========================================================================
    // EASY MODE: More money, cheaper construction
    // =========================================================================

    api.modifyConstants({
        // Start with 10 billion instead of 3 billion
        STARTING_MONEY: 10_000_000_000,

        // Higher ticket prices for more revenue
        DEFAULT_TICKET_COST: 5,

        // Cheaper construction
        CONSTRUCTION_COSTS: {
            TUNNEL: {
                SINGLE_MULTIPLIER: 0.5,  // Half tunnel cost
                DOUBLE_MULTIPLIER: 0.6,  // Half double track cost
            },
            STATION: {
                BASE_COST: 25_000_000,   // Half station cost
            },
        },
    });

    console.log('[Game Tweaks] Easy mode enabled!');

    // =========================================================================
    // ALTERNATIVE: Hard Mode (uncomment to use instead)
    // =========================================================================

    /*
    api.modifyConstants({
        STARTING_MONEY: 1_000_000_000,   // Only 1 billion
        DEFAULT_TICKET_COST: 2,           // Lower ticket prices
        CONSTRUCTION_COSTS: {
            TUNNEL: {
                SINGLE_MULTIPLIER: 1.5,   // 50% more expensive
            },
        },
    });
    console.log('[Game Tweaks] Hard mode enabled!');
    */

    // =========================================================================
    // Modify existing train types
    // =========================================================================

    // Make heavy metro faster but more expensive
    api.trains.modifyTrainType('heavy-metro', {
        stats: {
            maxSpeed: 30,               // Faster (was 22)
            carCost: 3_500_000,         // More expensive (was 2.5M)
        },
    });

    // Make light metro cheaper but slower
    api.trains.modifyTrainType('light-metro', {
        stats: {
            maxSpeed: 18,               // Slower
            carCost: 1_500_000,         // Cheaper
            baseTrackCost: 25_000,      // Cheaper track
        },
    });

    console.log('[Game Tweaks] Train types modified!');
});
