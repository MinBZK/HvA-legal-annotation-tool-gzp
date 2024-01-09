// POST METHODS

import { User } from "../models/user";

export async function getUsers() {
    const response = await fetch(`http://localhost:8000/api/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

export async function getUser(id: Number) {
    const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

export async function createUser(user: User) {
    const response = await fetch(`http://localhost:8000/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    return response.json();
}