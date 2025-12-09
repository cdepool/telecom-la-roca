// Types for the enhanced POD Designer

export interface Point {
    x: number;
    y: number;
}

export interface DrawingPath {
    id: string;
    points: Point[];
    color: string;
    width: number;
    opacity: number;
    tool: 'pencil' | 'eraser' | 'line';
}

export interface CanvasElement {
    id: string;
    type: 'rect' | 'circle' | 'text' | 'image' | 'path';
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    text?: string;
    fontSize?: number;
    color: string;
    opacity: number;
    imageData?: string;
    selected?: boolean;
    locked?: boolean;
    visible?: boolean;
    layerId: string;
    // For path elements
    paths?: DrawingPath[];
}

export interface Layer {
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
    opacity: number;
    elements: string[]; // Element IDs
}

export interface DesignHistory {
    past: CanvasElement[][];
    present: CanvasElement[];
    future: CanvasElement[][];
}

export interface OrderFormData {
    customerName: string;
    email: string;
    phone: string;
    productType: 'tshirt' | 'case' | 'mug';
    quantity: number;
    notes: string;
    preferredDate?: string;
}

export interface DesignExport {
    designImage: string; // Base64 PNG
    orderInfo: OrderFormData;
    designData: {
        elements: CanvasElement[];
        layers: Layer[];
        productType: string;
        dimensions: {
            width: number;
            height: number;
        };
    };
    metadata: {
        createdAt: string;
        referenceNumber: string;
    };
}

export type Tool =
    | 'select'
    | 'pencil'
    | 'eraser'
    | 'line'
    | 'text'
    | 'rect'
    | 'circle'
    | 'image';

export type ProductType = 'tshirt' | 'case' | 'mug';
