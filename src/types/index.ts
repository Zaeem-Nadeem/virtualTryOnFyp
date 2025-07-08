export interface GlassesProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  color: string;
}

export interface CartItem extends GlassesProduct {
  quantity: number;
}

export interface GlassesAdjustments {
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
}

export interface FaceLandmarks {
  leftEye: number[];
  rightEye: number[];
  eyeCenter: number[];
}