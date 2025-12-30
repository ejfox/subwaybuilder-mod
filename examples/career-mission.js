/**
 * Career Mission Example (Bushwick Express)
 *
 * Custom NYC career mission that uses geographic metrics to track
 * actual passenger flows from Bushwick to Lower Manhattan.
 *
 * This mod demonstrates:
 * - Using api.career.registerMission() to add career missions
 * - Using geographic bounding boxes for region tracking
 * - Using STATIONS_IN_REGION and PASSENGERS_BETWEEN_REGIONS metrics
 */

(function () {
    'use strict';

    var api = window.SubwayBuilderAPI;
    if (!api || !api.career) {
        console.error('[Career Mission] API not available');
        return;
    }

    // Define geographic regions as bounding boxes [west, south, east, north]
    var BUSHWICK_BBOX = [-73.935, 40.688, -73.905, 40.71];
    var LOWER_MANHATTAN_BBOX = [-74.02, 40.698, -73.97, 40.725];
    var WILLIAMSBURG_BBOX = [-73.97, 40.7, -73.935, 40.725];

    // Register the mission
    api.career.registerMission({
        id: 'bushwick-express',
        name: 'Bushwick Express',
        description: 'Connect the creative heart of Brooklyn to Manhattan\'s jobs',
        cityCode: 'NYC',  // Only appears in NYC
        tier: 'starter',  // Difficulty tier

        stars: [
            {
                description: 'Build 3 stations in Bushwick/Williamsburg',
                metric: api.career.METRICS.STATIONS_IN_REGION,
                target: 3,
                params: {
                    bbox: BUSHWICK_BBOX,
                    // Can also include multiple regions:
                    // additionalBboxes: [WILLIAMSBURG_BBOX]
                }
            },
            {
                description: 'Transport 1,000 passengers from Bushwick to Manhattan',
                metric: api.career.METRICS.PASSENGERS_BETWEEN_REGIONS,
                target: 1000,
                params: {
                    originBbox: BUSHWICK_BBOX,
                    destBbox: LOWER_MANHATTAN_BBOX,
                }
            },
            {
                description: 'Transport 5,000 passengers from Bushwick to Manhattan',
                metric: api.career.METRICS.PASSENGERS_BETWEEN_REGIONS,
                target: 5000,
                params: {
                    originBbox: BUSHWICK_BBOX,
                    destBbox: LOWER_MANHATTAN_BBOX,
                }
            }
        ],

        // Optional: rewards for completing stars
        rewards: {
            star1: { money: 1000000 },
            star2: { money: 5000000 },
            star3: { money: 10000000, unlocks: ['express-service'] },
        }
    });

    console.log('[Bushwick Express] Mission registered!');
    api.ui.showNotification('Bushwick Express mission added!', 'success');
})();
