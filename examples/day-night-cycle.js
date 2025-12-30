/**
 * Day/Night Theme Cycle Mod
 *
 * Automatically switches between light and dark theme based on in-game time.
 * - Day (6:00 - 17:59): Light theme
 * - Night (18:00 - 5:59): Dark theme
 *
 * This mod demonstrates:
 * - Using gameState.getCurrentHour() to read game time
 * - Using ui.setTheme() to change the app theme
 * - Using hooks.onGameInit() for initialization
 * - Using setInterval for periodic checks
 */

(function () {
    'use strict';

    // Configuration
    const DAY_START_HOUR = 6;  // 6:00 AM
    const DAY_END_HOUR = 18;   // 6:00 PM

    // State tracking
    let lastThemeWasDay = null;
    let checkInterval = null;

    function isDaytime(hour) {
        return hour >= DAY_START_HOUR && hour < DAY_END_HOUR;
    }

    function updateTheme() {
        const api = window.SubwayBuilderAPI;
        if (!api) return;

        const currentHour = api.gameState.getCurrentHour();
        const isDay = isDaytime(currentHour);

        if (lastThemeWasDay !== isDay) {
            const newTheme = isDay ? 'light' : 'dark';
            api.ui.setTheme(newTheme);

            if (lastThemeWasDay !== null) {
                const timeStr = isDay ? 'sunrise' : 'sunset';
                api.ui.showNotification(`Theme changed to ${newTheme} (${timeStr})`, 'info');
            }

            lastThemeWasDay = isDay;
        }
    }

    function init() {
        const api = window.SubwayBuilderAPI;
        if (!api) return;

        updateTheme();
        checkInterval = setInterval(updateTheme, 1000);
        api.ui.showNotification('Day/Night cycle mod loaded!', 'success');
    }

    // Wait for API
    if (window.SubwayBuilderAPI) {
        window.SubwayBuilderAPI.hooks.onGameInit(init);
    } else {
        const check = setInterval(() => {
            if (window.SubwayBuilderAPI) {
                clearInterval(check);
                window.SubwayBuilderAPI.hooks.onGameInit(init);
            }
        }, 100);
    }
})();
