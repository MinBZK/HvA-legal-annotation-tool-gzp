import React from 'react';
import './navigation.css';
import SelectUserButton from '../select-user-button/select-user-button';

export default function Navigation() {

    return <>
        <nav className="navbar">
            <div className="navbar-title">Legal Annotation Tool</div>
            <div className="buttons">
                <SelectUserButton></SelectUserButton>
            </div>
        </nav>
    </>;
};
