import { QueryFunctionContext } from "@tanstack/react-query";
import User from "./user";


// Define the paginated response structure
export type UsersResponse = {
    users: User[];
    nextCursor?: number;
};




export type CustomQueryFunctionContext = QueryFunctionContext & {
    pageParam: number
};