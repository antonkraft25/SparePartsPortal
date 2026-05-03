export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    customerId: string;
    role: string;
}

export type LoginCreds = {
    email: string;
    password: string;
}