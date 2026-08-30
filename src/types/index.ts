export interface Colorway {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  badge?: string;
  primaryColor: string; // hex
  secondaryColor: string; // hex
  accentColor: string; // hex
  soleColor: string; // hex
  glowColor: string;
  description: string;
  specs: {
    weight: string;
    energyReturn: string;
    drop: string;
    material: string;
  };
}

export interface CustomizerState {
  upperColor: string;
  soleColor: string;
  accentColor: string;
  strapColor: string;
  lacesColor: string;
  glowColor: string;
  finish: 'matte' | 'glossy' | 'metallic' | 'carbon';
}

export interface CartItem {
  id: string;
  colorwayId: string;
  title: string;
  size: number;
  price: number;
  quantity: number;
  customConfig?: CustomizerState;
  colorName: string;
}

export interface TechHotspot {
  id: string;
  title: string;
  partName: string;
  description: string;
  position: [number, number, number];
  metric: string;
}
