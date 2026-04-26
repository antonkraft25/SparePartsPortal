export type OrderItem = {
    sparepartId: string;
    sparepartName: string;
    sparepartLocation: string;
    quantity: number;
    quantitySent: number;
}

export type Order = {
    id: string;
    orderDate: string;
    status: string;
    userName: string;
    deliveryAddress: {
        streetName: string;
        city: string;
        postalcode: string;
    };
    items: OrderItem[];
}