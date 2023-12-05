'use client';
import React, { useState, useEffect } from 'react';
import '../static/annotations.css';
import { Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Annotation} from "@/app/models/annotation";
import {AnnotationHasClass} from "@/app/models/annotation-has-class";

export default function AnnotationPage() {
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [annotationsWithClass, setAnnotationsWithClass] = useState<AnnotationHasClass[]>([]);
    const [annotationData, setAnnotationData] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState(''); // text being edited

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

    const fetchAnnotationsWithClasses = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/annotationswithclasses');
            if (response.ok) {
                // const data = await response.json();
                const array: AnnotationHasClass[] = [];
                response.json().then((value) => {
                    for (let i = 0; i < value.length; i++) {
                        const data = value[i]
                        array.push(data)
                    }
                })
                setAnnotationsWithClass(array);

            } else {
                console.error('Error fetching annotations');
            }
        } catch (error) {
            console.error('Error fetching annotations:', error);
        }
    };

    // Use useEffect to fetch annotations when the component mounts
    useEffect(() => {
        // fetchAnnotations();
        fetchAnnotationsWithClasses()
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnnotationData(event.target.value);
    };
    const handleEditChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditText(event.target.value);
    };

    const startEdit = (annotation: Annotation) => {
        setEditingId(annotation.id);
        setEditText(annotation.text);
    };


    const handleEdit = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8000/api/updateAnnotation/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: editText }),
            });

            if (response.ok) {
                alert('Annotation updated successfully');
                setEditingId(null); // Exit edit mode
                fetchAnnotations(); // Refetch annotations
            } else {
                alert('Error updating annotation');
            }
        } catch (error) {
            console.error('Error updating annotation:', error);
            alert('Error updating annotation');
        }
    };




    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8000/api/deleteAnnotation/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Annotation deleted successfully');
                fetchAnnotations(); // Refetch annotations to update the list
            } else {
                alert('Error deleting annotation');
            }
        } catch (error) {
            console.error('Error deleting annotation:', error);
            alert('Error deleting annotation');
        }
    };



    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
3
        const newAnnotation = { text: annotationData }; // Create a new annotation object

        try {
            const response = await fetch('http://localhost:8000/api/saveAnnotation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAnnotation),
            });

            if (response.ok) {
                alert('Annotation saved successfully');
                setAnnotationData(''); // Reset the input field
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
                    {annotationsWithClass.map((annotationWithClass) => (
                        <Card key={annotationWithClass.annotation.id} className="mb-2">
                            <Card.Body>

                                <div style={{background: annotationWithClass.aClass.color}}></div>
                                <Card.Title>ID: {annotationWithClass.annotation.id}</Card.Title>
                                {editingId === annotationWithClass.annotation.id ? (
                                    <Form.Control
                                        as="textarea"
                                        value={editText}
                                        onChange={handleEditChange}
                                    />
                                ) : (
                                    <Card.Text>
                                        Annotation Text: {annotationWithClass.annotation.text}
                                    </Card.Text>
                                )}
                                {editingId === annotationWithClass.annotation.id ? (
                                    <Button variant="success" onClick={() => handleEdit(annotationWithClass.annotation.id)}>Save</Button>
                                ) : (
                                    <Button variant="secondary" onClick={() => startEdit(annotationWithClass.annotation)}>Edit</Button>
                                )}
                                <Button variant="danger" onClick={() => handleDelete(annotationWithClass.annotation.id)}>Delete</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </main>
        </>
    );
}