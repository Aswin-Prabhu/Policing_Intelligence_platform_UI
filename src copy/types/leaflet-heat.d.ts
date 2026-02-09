declare module 'leaflet.heat' {
  const _noop: unknown;
  export default _noop;
}

// Minimal augmentation for the heatLayer factory used by leaflet.heat
declare module 'leaflet' {
  export function heatLayer(
    latlngs: Array<[number, number, number] | [number, number]>,
    options?: {
      minOpacity?: number;
      maxZoom?: number;
      radius?: number;
      blur?: number;
      gradient?: Record<number, string>;
    }
  ): any;
}


