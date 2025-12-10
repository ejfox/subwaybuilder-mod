/**
 * TypeScript definitions for Subway Builder Modding API
 *
 * Add this to your tsconfig.json or reference directly:
 * /// <reference path="./types.d.ts" />
 */

declare global {
    interface Window {
        SubwayBuilderAPI: SubwayBuilderAPI;
    }
}

// ============================================================================
// MAIN API
// ============================================================================

interface SubwayBuilderAPI {
    version: string;

    /** Register a new city */
    registerCity: (city: City) => void;

    /** Modify game constants */
    modifyConstants: (constants: Partial<GameConstants>) => void;

    /** Register newspaper templates */
    registerNewspaperTemplates: (templates: NewspaperTemplate[]) => void;

    /** Register tweet templates */
    registerTweetTemplates: (templates: TweetTemplate[]) => void;

    /** Map-related functions */
    map: MapAPI;

    /** Train type functions */
    trains: TrainsAPI;

    /** UI functions */
    ui: UIAPI;

    /** Lifecycle hooks */
    hooks: HooksAPI;

    /** Utility functions */
    utils: UtilsAPI;

    /** Game state access (read-only) */
    gameState: GameStateAPI;

    /** Zod validation schemas */
    schemas: SchemasAPI;
}

// ============================================================================
// CITY
// ============================================================================

interface City {
    name: string;
    code: string;
    description?: string;
    population?: number;
    initialViewState: {
        zoom: number;
        latitude: number;
        longitude: number;
        bearing?: number;
        pitch?: number;
    };
    minZoom?: number;
    /** Custom thumbnail URL for city select screen */
    mapImageUrl?: string;
    /** Custom data URL for city files */
    dataUrl?: string;
}

// ============================================================================
// TRAIN TYPES
// ============================================================================

interface TrainsAPI {
    /** Register a new train type */
    registerTrainType: (trainType: TrainType) => void;

    /** Modify an existing train type */
    modifyTrainType: (id: string, modifications: Partial<TrainType>) => void;

    /** Get all registered train types */
    getTrainTypes: () => Record<string, TrainType>;

    /** Get a specific train type by ID */
    getTrainType: (id: string) => TrainType | undefined;
}

interface TrainType {
    id: string;
    name: string;
    description?: string;
    stats: TrainStats;
    compatibleTrackTypes: string[];
    appearance?: {
        color?: string;
        icon?: string;
    };
    /** Allow tracks to cross roads at grade (for trams/streetcars) */
    allowAtGradeRoadCrossing?: boolean;
    /** Custom elevation cost multipliers */
    elevationMultipliers?: ElevationMultipliers;
}

interface TrainStats {
    maxAcceleration: number;
    maxDeceleration: number;
    maxSpeed: number;
    maxSpeedLocalStation: number;
    capacityPerCar: number;
    carLength: number;
    minCars: number;
    maxCars: number;
    carsPerCarSet: number;
    carCost: number;
    trainWidth: number;
    minStationLength: number;
    maxStationLength: number;
    baseTrackCost: number;
    baseStationCost: number;
    trainOperationalCostPerHour: number;
    carOperationalCostPerHour: number;
    scissorsCrossoverCost: number;
}

interface ElevationMultipliers {
    DEEP_BORE?: number;
    STANDARD_TUNNEL?: number;
    CUT_AND_COVER?: number;
    AT_GRADE?: number;
    ELEVATED?: number;
}

// ============================================================================
// MAP
// ============================================================================

interface MapAPI {
    /** Register a tile source */
    registerSource: (id: string, source: MapSource) => void;

    /** Register a map layer */
    registerLayer: (layer: MapLayer) => void;

    /** Register a custom map style */
    registerStyle: (styleUrl: string) => void;

    /** Set a layer override */
    setLayerOverride: (layerId: string, properties: Record<string, unknown>) => void;

    /** Set default layer visibility for a city */
    setDefaultLayerVisibility: (cityCode: string, defaults: Record<string, boolean>) => void;

    /** Get default layer visibility for a city */
    getDefaultLayerVisibility: (cityCode: string) => Record<string, boolean> | undefined;

    /** Set routing service override for a city */
    setRoutingServiceOverride: (config: RoutingServiceConfig) => void;

    /** Query a route */
    queryRoute: (cityCode: string, origin: [number, number], destination: [number, number]) => Promise<RouteResult | null>;
}

interface MapSource {
    type: 'raster' | 'vector' | 'geojson';
    tiles?: string[];
    tileSize?: number;
    data?: GeoJSON.FeatureCollection;
    url?: string;
}

interface MapLayer {
    id: string;
    type: 'fill' | 'line' | 'symbol' | 'circle' | 'raster';
    source: string;
    paint?: Record<string, unknown>;
    layout?: Record<string, unknown>;
    filter?: unknown[];
}

interface RoutingServiceConfig {
    cityCode: string;
    routingUrl: string;
    format: 'osrm' | 'valhalla' | 'graphhopper' | 'custom';
    customParser?: (response: unknown) => RouteResult;
}

interface RouteResult {
    drivingSeconds: number;
    drivingDistance: number;
    drivingPath?: [number, number][];
}

// ============================================================================
// UI
// ============================================================================

interface UIAPI {
    /** Register a custom UI component */
    registerComponent: (placement: UIPlacement, config: UIComponentConfig) => void;

    /** Show a notification */
    showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

type UIPlacement = 'settings-menu' | 'escape-menu' | 'bottom-bar' | 'top-bar' | 'debug-panel';

interface UIComponentConfig {
    id: string;
    component: React.ComponentType;
}

// ============================================================================
// HOOKS
// ============================================================================

interface HooksAPI {
    /** Called when the game initializes */
    onGameInit: (callback: () => void) => void;

    /** Called when a city loads */
    onCityLoad: (callback: (cityCode: string) => void) => void;

    /** Called when the game day changes */
    onDayChange: (callback: (day: number) => void) => void;

    /** Called when the map is ready */
    onMapReady: (callback: (map: maplibregl.Map) => void) => void;
}

// ============================================================================
// UTILITIES
// ============================================================================

interface UtilsAPI {
    /** Get all registered cities */
    getCities: () => City[];

    /** Get game constants */
    getConstants: () => GameConstants;

    /** Get the MapLibre map instance */
    getMap: () => maplibregl.Map | null;
}

// ============================================================================
// GAME STATE
// ============================================================================

interface GameStateAPI {
    /** Get all stations */
    getStations: () => Station[];

    /** Get all routes */
    getRoutes: () => Route[];

    /** Get all tracks (includes startElevation/endElevation) */
    getTracks: () => Track[];

    /** Get all trains */
    getTrains: () => Train[];

    /** Get demand data */
    getDemandData: () => DemandData | null;

    /** Get current game day */
    getCurrentDay: () => number;

    /** Get current budget/money */
    getBudget: () => number;

    /** Calculate total cost for blueprint tracks */
    calculateBlueprintCost: (tracks: Track[]) => ConstructionCost;
}

interface Station {
    id: string;
    name: string;
    coords: [number, number];
    stationGroup?: string;
    [key: string]: unknown;
}

interface Route {
    id: string;
    name: string;
    stations: string[];
    color?: string;
    [key: string]: unknown;
}

interface Track {
    id: string;
    startNode: string;
    endNode: string;
    startElevation: number;
    endElevation: number;
    displayType?: 'blueprint' | 'constructed' | 'ghost';
    [key: string]: unknown;
}

interface Train {
    id: string;
    routeId: string;
    position: [number, number];
    [key: string]: unknown;
}

interface DemandData {
    points: Map<string, DemandPoint>;
    popsMap: Map<string, Pop>;
}

interface DemandPoint {
    id: string;
    location: [number, number];
    jobs: number;
    residents: number;
    popIds: string[];
}

interface Pop {
    id: string;
    size: number;
    residenceId: string;
    jobId: string;
    drivingSeconds: number;
    drivingDistance: number;
    /** Optional driving path geometry */
    drivingPath?: [number, number][];
}

interface ConstructionCost {
    totalCost: number;
    breakdown: {
        trackCost: number;
        stationCost: number;
        scissorsCrossoverCost: number;
        buildingDemolitionCost: number;
    };
}

// ============================================================================
// SCHEMAS (Zod)
// ============================================================================

interface SchemasAPI {
    DemandDataSchema: ZodSchema<{ points: DemandPoint[]; pops: Pop[] }>;
    DemandPointSchema: ZodSchema<DemandPoint>;
    PopSchema: ZodSchema<Pop>;
    CitySchema: ZodSchema<City>;
    TrainTypeSchema: ZodSchema<TrainType>;
}

interface ZodSchema<T> {
    parse: (data: unknown) => T;
    safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: ZodError };
}

interface ZodError {
    errors: Array<{
        path: (string | number)[];
        message: string;
        code: string;
    }>;
}

// ============================================================================
// GAME CONSTANTS
// ============================================================================

interface GameConstants {
    STARTING_MONEY?: number;
    DEFAULT_TICKET_COST?: number;
    CONSTRUCTION_COSTS?: {
        TUNNEL?: {
            SINGLE_MULTIPLIER?: number;
            DOUBLE_MULTIPLIER?: number;
        };
        STATION?: {
            BASE_COST?: number;
        };
        ELEVATION_MULTIPLIERS?: ElevationMultipliers;
    };
    [key: string]: unknown;
}

// ============================================================================
// CONTENT TEMPLATES
// ============================================================================

interface NewspaperTemplate {
    headline: string;
    content: string;
    metadata?: {
        category?: string;
        tone?: string;
        requiredGameState?: {
            minStations?: number;
            minRoutes?: number;
            minPassengers?: number;
        };
        weight?: number;
    };
}

interface TweetTemplate {
    text: string;
    tone?: string;
    requiredGameState?: {
        minStations?: number;
        minPassengers?: number;
    };
}

export {};
