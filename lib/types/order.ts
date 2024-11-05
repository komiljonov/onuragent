import User from "./user";





interface IOrderItem {
    id: string;
    name: string;
    
    count: number;
    price: number;
    sum: number;
    total_price: number;
}



type IOrder = {
    id: string;
    created_at: string;
    shipment_date: string;
    price: number;
    status: string;
    counterparty: User;
    products: IOrderItem[];
};




export default IOrder;