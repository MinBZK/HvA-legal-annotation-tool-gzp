import { User } from '../models/user';

// Define a type for the callback function used in the observer pattern
type Callback = (user: User) => void;

// Store the currently selected user
let selectedUser: User;

// Array to store the subscribers (callbacks) that want to be notified on user changes
let subscribers: Callback[] = [];

// Set the selected user and notify all subscribers
const setSelectedUser = (user: User) => {
  selectedUser = user;
  notifySubscribers();
};

// Get the currently selected user
const getSelectedUser = () => {
  return selectedUser;
};

// Subscribe a callback function to be notified when the selected user changes
const subscribe = (callback: Callback) => {
  subscribers.push(callback);
};

// Unsubscribe a callback function to stop receiving notifications on user changes
const unsubscribe = (callback: Callback) => {
  subscribers = subscribers.filter((subscriber) => subscriber !== callback);
};

// Notify all subscribers about the change in the selected user
const notifySubscribers = () => {
  // Iterate through each subscriber and invoke their callback with the selected user
  subscribers.forEach((subscriber) => {
    // Ensure that the subscriber is a function before invoking it
    if (typeof subscriber === 'function') {
      subscriber(selectedUser);
    }
  });
};

// Export the functions for external use
export { setSelectedUser, getSelectedUser, subscribe, unsubscribe };

/**
 * Get users
 * @returns List of User
 */
export async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
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

/**
 * Get user
 * @param id Id of user to be fetched
 * @returns User
 */
export async function getUser(id: Number): Promise<User> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

/**
 * Get roles
 * @returns List of user roles
 */
export async function getRoles(): Promise<string[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
}

/**
 * Create user
 * @param user User to be created
 * @returns API response
 */
export async function createUser(user: User): Promise<Response> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Dele user
 * @param id Id of the user to be deleted
 * @returns API response
 */
export async function deleteUser(id: Number): Promise<Response> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
