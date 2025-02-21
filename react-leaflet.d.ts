declare module 'react-leaflet' {
  import * as L from 'leaflet';

  interface MarkerProps {
    icon?: L.Icon;
  }

  interface TooltipProps {
    permanent?: boolean;
  }

  interface TileLayerProps {
    attribution?: string;
  }
}
