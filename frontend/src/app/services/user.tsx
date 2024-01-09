// POST METHODS

import { User } from "../models/user";

export async function getUsers() {
    try {
        const response = await fetch(`http://localhost:8000/api/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
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

export async function getRoles() {
    const response = await fetch(`http://localhost:8000/api/users/roles`, {
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

    return response;
}

export async function deleteUser(id: Number) {
    const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response;
}