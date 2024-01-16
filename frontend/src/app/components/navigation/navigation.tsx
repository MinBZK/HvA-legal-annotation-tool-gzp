import React from 'react';
import './navigation.css';
import SelectUserButton from '../select-user-button/select-user-button';
import Link from 'next/link';

export default function Navigation() {

    return <>
        <nav className="navbar">
            <div className="navbar-title">Legal Annotation Tool</div>
            <div className="buttons">
                <Link className='term-button' href={{ pathname: '/terms' }}>Begrippen</Link>
                <SelectUserButton></SelectUserButton>
            </div>
        </nav>
    </>;
};
