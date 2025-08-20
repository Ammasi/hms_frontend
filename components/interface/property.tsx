
export interface RoomType {
    isDefault(isDefault: any): import("react").ReactNode;
    defaultName: string;
    customName?: string;
}


export interface Floor {
    defaultName: string;
    customName?: string;
    roomCount: number;
}

export interface PropertyData {
    id: string;
    clientId: string;
    propertyName: string;
    propertyType: string;
    propertyCreateCount: string;
    propertyContact: string;
    propertyEmail: string;
    propertyImage: string;
    propertyAddress: string;
    includeGroundFloor: boolean;
    noOfFloors: number;
    roomTypeCount: number;
    floors: Floor[];
    city: string;
    pinCode: string;
    starRating: string;
    totalRooms: string;
    facility: string;
    policies: string;
    status: string;
    commonId: string;
    createdAt: string;
    updatedAt: string;
    roomTypes?: RoomType[];
}