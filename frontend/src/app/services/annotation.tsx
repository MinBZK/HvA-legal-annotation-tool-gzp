// POST METHODS

export async function getChildAnnotationsFromParentId(id: Number) {
    const response = await fetch(`http://localhost:8000/api/annotations/children/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}