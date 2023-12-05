'use client';
import React, { useState, useEffect } from 'react';
import '../static/annotations.css';
import { Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AnnotationPage() {
    const [annotations, setAnnotations] = useState([]);
    const [annotationData, setAnnotationData] = useState('');

    // Define fetchAnnotations outside of useEffect
    const fetchAnnotations = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/annotations');
            if (response.ok) {
                const data = await response.json();
                setAnnotations(data);
            } else {
                console.error('Error fetching annotations');
            }
        } catch (error) {
            console.error('Error fetching annotations:', error);
        }
    };

    // Use useEffect to fetch annotations when the component mounts
    useEffect(() => {
        fetchAnnotations();
    }, []);

    const handleInputChange = (event) => {
        setAnnotationData(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/saveAnnotation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: annotationData }),
            });

            if (response.ok) {
                alert('Annotation saved successfully');
                setAnnotationData('');
                fetchAnnotations(); // Refetch annotations to update the list
            } else {
                alert('Error saving annotation');
            }
        } catch (error) {
            console.error('Error submitting annotation:', error);
            alert('Error submitting annotation');
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-title">Legal Annotation Tool</div>
            </nav>

            <main>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            value={annotationData}
                            onChange={handleInputChange}
                            placeholder="Enter your annotation here"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">Save Annotation</Button>
                </Form>

                <div className="annotations-list mt-4">
                    {annotations.map((annotation) => (
                        <Card key={annotation.id} className="mb-2">
                            <Card.Body>
                                <Card.Text>
                                    {annotation.content} {}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </main>
        </>
    );
}