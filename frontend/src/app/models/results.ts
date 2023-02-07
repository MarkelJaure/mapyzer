export interface Results {
    x: Number, // lon,
    y: Number, // lat,
    label: String, // formatted address
    bounds: [
        [Number, Number], // s, w - lat, lon
        [Number, Number], // n, e - lat, lon
    ],
    raw: {}, // raw provider result
};
