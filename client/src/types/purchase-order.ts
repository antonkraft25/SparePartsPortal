export type PoItem = {
  sparepartId: string;
  sparepartName: string;
  sparepartLocation: string;
  quantity: number;
  quantityReceived: number;
};

export type PurchaseOrder = {
  id: string;
  date: string;
  status: string;
  userName: string;
  items: PoItem[];
};
