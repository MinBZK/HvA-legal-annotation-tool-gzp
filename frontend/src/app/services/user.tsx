import { User } from "../models/user";

type Callback = (user: User) => void;

let selectedUser: User;
let subscribers: Callback[] = [];

const setSelectedUser = (user: User) => {
    selectedUser = user;
    notifySubscribers();
};

const getSelectedUser = () => {
    return selectedUser;
};

const subscribe = (callback: Callback) => {
    subscribers.push(callback);
};

const unsubscribe = (callback: Callback) => {
    subscribers = subscribers.filter(subscriber => subscriber !== callback);
};

const notifySubscribers = () => {
    subscribers.forEach(subscriber => {
        if (typeof subscriber === 'function') {
            subscriber(selectedUser);
        }
    });
};

export { setSelectedUser, getSelectedUser, subscribe, unsubscribe };
export async function getUsers() {
    try {
        const response = await fetch(`${process.env.API_URL}/users`, {
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
    const response = await fetch(`${process.env.API_URL}/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

export async function getRoles() {
    const response = await fetch(`${process.env.API_URL}/users/roles`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

export async function createUser(user: User) {
    const response = await fetch(`${process.env.API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    return response;
}

export async function deleteUser(id: Number) {
    const response = await fetch(`${process.env.API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response;
}