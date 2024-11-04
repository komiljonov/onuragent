import { UsersResponse } from "./types";

export async function fetchUsers(
    pageParam: number = 0): Promise<UsersResponse> {
    // Helper function to generate a random user
    const generateRandomUser = (id: number) => ({
        id,
        name: `User ${id}`,
        email: `user${id}@example.com`,
        number: `+998${Math.floor(1000000000 + Math.random() * 9000000000)}`, // random Uzbek-style number
        agentName: `Agent ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(100 + Math.random() * 900)}`
    });

    // Generate a random number of users for each page (between 5 and 10)
    const users = Array.from({ length: 100 }, (_, index) =>
        generateRandomUser(pageParam * 10 + index + 1)
    );

    // Simulate the next page cursor; stops pagination at 10 pages for example
    const nextCursor = pageParam < 9 ? pageParam + 1 : undefined;

    return {
        users,
        nextCursor,
    };
}