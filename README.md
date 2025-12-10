# Subway Builder Mod Template

A boilerplate for creating mods for [Subway Builder](https://subwaybuilder.com).

## Quick Start

1. **Clone this repo** into your mods folder:
   ```bash
   # macOS
   cd ~/Library/Application\ Support/SubwayBuilder/mods/
   git clone https://github.com/yourusername/subwaybuilder-mod my-mod

   # Windows
   cd %APPDATA%\SubwayBuilder\mods\
   git clone https://github.com/yourusername/subwaybuilder-mod my-mod

   # Linux
   cd ~/.config/SubwayBuilder/mods/
   git clone https://github.com/yourusername/subwaybuilder-mod my-mod
   ```

2. **Edit `manifest.json`** with your mod info:
   ```json
   {
     "id": "com.yourname.my-mod",
     "name": "My Awesome Mod",
     "version": "1.0.0"
   }
   ```

3. **Edit `index.js`** with your mod code

4. **Restart Subway Builder** and enable your mod in Settings > Mods

## Finding Your Mods Folder

If you can't find the mods folder:

1. Open Subway Builder
2. Go to **Settings > System**
3. Click **"Open Saves Folder"**
4. Navigate up one level - you'll see the `SubwayBuilder/` directory
5. Create a `mods/` folder if it doesn't exist

**Directory structure:**
```
SubwayBuilder/
├── saves/              ← Your save files
├── mods/               ← Put your mods here
│   └── my-mod/         ← Your mod folder
│       ├── manifest.json
│       └── index.js
└── settings.json
```

## Project Structure

```
subwaybuilder-mod/
├── manifest.json       # Mod metadata (required)
├── index.js            # Main entry point (required)
├── types.d.ts          # TypeScript definitions (for IDE support)
├── examples/           # Example mod snippets
│   ├── custom-city.js
│   ├── custom-train.js
│   ├── tram-mod.js
│   └── game-tweaks.js
├── data/               # Example data files for custom cities
│   ├── demand_data.example.json
│   └── metadata.example.json
├── scripts/            # Helper scripts
│   └── serve-data.js   # Local server for city data
└── README.md
```

## Examples

### Add a Custom City

```javascript
window.SubwayBuilderAPI.registerCity({
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
    // Optional: custom thumbnail
    mapImageUrl: 'http://127.0.0.1:8080/MTL/thumbnail.svg'
});
```

### Add a Tram/Streetcar

```javascript
window.SubwayBuilderAPI.trains.registerTrainType({
    id: 'tram',
    name: 'Streetcar',
    description: 'Light rail for street running',
    stats: {
        maxAcceleration: 1.2,
        maxDeceleration: 1.5,
        maxSpeed: 15,
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
        baseTrackCost: 15_000,
        baseStationCost: 5_000_000,
        trainOperationalCostPerHour: 100,
        carOperationalCostPerHour: 20,
        scissorsCrossoverCost: 1_000_000,
    },
    compatibleTrackTypes: ['tram'],
    appearance: { color: '#f59e0b' },

    // Tram-specific settings
    allowAtGradeRoadCrossing: true,  // Can cross roads at street level
    elevationMultipliers: {
        AT_GRADE: 0.5,               // Cheaper at street level
        ELEVATED: 1.8,               // More expensive elevated
    },
});
```

### Modify Game Rules

```javascript
window.SubwayBuilderAPI.modifyConstants({
    STARTING_MONEY: 10_000_000_000,  // 10B instead of 3B
    DEFAULT_TICKET_COST: 5,          // $5 tickets
    CONSTRUCTION_COSTS: {
        TUNNEL: {
            SINGLE_MULTIPLIER: 0.5   // Half tunnel cost
        }
    }
});
```

### Access Game State

```javascript
// Get current game data
const stations = window.SubwayBuilderAPI.gameState.getStations();
const routes = window.SubwayBuilderAPI.gameState.getRoutes();
const tracks = window.SubwayBuilderAPI.gameState.getTracks();
const budget = window.SubwayBuilderAPI.gameState.getBudget();
const day = window.SubwayBuilderAPI.gameState.getCurrentDay();

console.log(`Day ${day}: ${stations.length} stations, $${budget.toLocaleString()}`);
```

## TypeScript Support

This template includes `types.d.ts` with full type definitions. For the best development experience:

```typescript
// Your mod with type checking
const api = window.SubwayBuilderAPI;

api.registerCity({
    name: 'Montreal',
    code: 'MTL',
    // TypeScript will show errors for missing/wrong fields
});
```

## Serving Custom City Data

For custom cities, you need to serve data files. Use the included server script:

```bash
# Install dependencies
npm install

# Serve your city data from ./data/
npm run serve
# → Serving at http://127.0.0.1:8080
```

Then configure your mod to load from this server:

```javascript
window.SubwayBuilderAPI.registerCity({
    name: 'My City',
    code: 'MYC',
    dataUrl: 'http://127.0.0.1:8080/MYC',
});
```

## Validating Your Data

The API exposes Zod schemas for data validation:

```javascript
const schemas = window.SubwayBuilderAPI.schemas;

// Validate demand_data.json
const result = schemas.DemandDataSchema.safeParse(myData);
if (!result.success) {
    console.error('Validation errors:', result.error.errors);
}
```

## Lifecycle Hooks

```javascript
// When the game starts
window.SubwayBuilderAPI.hooks.onGameInit(() => {
    console.log('Game initialized!');
});

// When a city loads
window.SubwayBuilderAPI.hooks.onCityLoad((cityCode) => {
    if (cityCode === 'MTL') {
        // Do Montreal-specific setup
    }
});

// When a day passes
window.SubwayBuilderAPI.hooks.onDayChange((day) => {
    if (day % 100 === 0) {
        console.log(`Milestone: Day ${day}!`);
    }
});

// When the map is ready
window.SubwayBuilderAPI.hooks.onMapReady((map) => {
    // Access raw MapLibre instance
    map.on('click', (e) => console.log('Clicked:', e.lngLat));
});
```

## API Reference

See the [full modding documentation](https://github.com/ejfox/metro-maker4/blob/main/MODDING.md) for complete API reference.

## License

MIT - do whatever you want with this template!
