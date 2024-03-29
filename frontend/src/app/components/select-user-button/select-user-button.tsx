import React, { useEffect, useState } from 'react';
import './select-user-button.css';
import { FaUserCog } from 'react-icons/fa';
import { Form, Modal } from 'react-bootstrap';
import { createUser, deleteUser, getRoles, getUsers, setSelectedUser, subscribe, unsubscribe } from '@/app/services/user';
import { User } from '../../models/user';
import { FiTrash2 } from 'react-icons/fi';


export default function SelectUserButton() {
    // Initialize component state
    const [showUserSelectModal, setShowUserSelectModal] = useState(false);
    const [showNewUserModal, setShowNewUserModal] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [newUser, setNewUser] = useState<User>({
        id: 0,
        name: "",
        role: ""
    });
    const [activeUserId, setActiveUserId] = useState<number>();

    // Effect to subscribe and unsubscribe from user changes
    useEffect(() => {
        const handleUserChange = (user: User) => {
            setActiveUserId(user.id);
        };

        subscribe(handleUserChange);

        return () => {
            unsubscribe(handleUserChange);
        };
    }, []);

    // Effect to fetch users, roles, and handle initial setup
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await getUsers();

                // If no users, create a default Admin user
                if (allUsers.length === 0) {
                    await handleNewUser({ id: 0, name: "Admin", role: "Admin" });
                    setShowUserSelectModal(false);
                } else {
                    setUsers(allUsers);
                }

                // Handle user selection from localStorage
                if (localStorage.getItem('user') === "undefined" || localStorage.getItem('user') === null) {
                    handleSelectUser(allUsers[0]);
                } else {
                    const userJson = localStorage.getItem('user');
                    if (userJson !== null) {
                        const user = JSON.parse(userJson);
                        if (user && typeof user === 'object' && 'id' in user) {
                            setSelectedUser(user);
                        } else {
                            console.error('Invalid user data in localStorage');
                        }
                    } else {
                        console.error('No user data in localStorage');
                    }
                }

                // Fetch roles and set state
                const allRoles = await getRoles();
                setRoles(allRoles);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Handle opening the "New User" modal
    const handleNewUserModal = () => {
        setShowUserSelectModal(false);
        setShowNewUserModal(true);
    }

    // Handle creating or updating a user
    const handleNewUser = async (insertedNewUser: User | undefined = undefined) => {
        const user = insertedNewUser !== undefined ? insertedNewUser : newUser;

        if (user.name && user.role) {
            if (await createUser(user)) {
                const allUsers = await getUsers();
                setUsers(allUsers);
                setShowUserSelectModal(true);
                setShowNewUserModal(false);
            }
        }
    }

    // Handle deleting a user
    const handleDelete = async (id: number) => {
        if (await deleteUser(id)) {
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

            const userJson = localStorage.getItem('user');
            if (userJson !== null) {
                const user = JSON.parse(userJson);

                if (user.id === id && users.length > 1) {
                    handleSelectUser(users[0]);
                } else if (user.id === id) {
                    localStorage.removeItem('user');
                }
            }
        }
    }

    // Handle selecting a user
    const handleSelectUser = (user: User) => {
        localStorage.setItem("user", JSON.stringify(user));
        setSelectedUser(user);
    }

    // Render the component
    if (users && roles) {
        return <>
            <button className='select-user' onClick={() => { setShowUserSelectModal(true) }}>
                <FaUserCog />
            </button>
            {/* User Selection Modal */}
            <Modal show={showUserSelectModal} onHide={() => { setShowUserSelectModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecteer een gebruiker</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {users.map((user) => (
                        <div className='user-select mb-1' key={user.id}><div><span>{user.role}</span><span>{user.name}</span></div>
                            <div>
                                <button className='switch-user' onClick={() => { handleSelectUser(user) }}>{activeUserId == user.id ? "Geselecteerd" : "Selecteer"}</button>
                                <button className='ms-2 delete-button' onClick={() => { handleDelete(user.id) }}><FiTrash2 /></button>
                            </div>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <button className='new-user' onClick={handleNewUserModal}>Maak nieuwe gebruiker</button>
                </Modal.Footer>
            </Modal>
            {/* New User Modal */}
            <Modal show={showNewUserModal} onHide={() => { setShowNewUserModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Maak nieuwe gebruiker</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="userName">
                        <Form.Label><b>Gebruikers naam</b></Form.Label>
                        <Form.Control type="text" onChange={(e) => {
                            setNewUser({ ...newUser, name: e.target.value })
                        }} />
                    </Form.Group>
                    <Form.Group controlId="userRole" className='mt-2'>
                        <Form.Label><b>Rol</b></Form.Label>
                        <Form.Select onChange={(e) => {
                            setNewUser({ ...newUser, role: e.target.value })
                        }}>
                            <option disabled selected>Selecteer een role</option>
                            {roles.map((role, index) => (
                                <option value={role.toString()} key={index} >{role}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <button className='create-user' onClick={() => { handleNewUser() }}>Opslaan</button>
                </Modal.Footer>
            </Modal>
        </>;
    }
};