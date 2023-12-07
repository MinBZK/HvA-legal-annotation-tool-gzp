export async function getProjectById(id: number) {
    const response = await fetch(`http://localhost:8000/api/project/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return await response;
}

export async function uploadXML(xmlContent: String) {
    const response = await fetch(`http://localhost:8000/api/saveXml`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "xml_content": xmlContent
        }),
    });

    return await response;
}

export async function getProjects() {
    const response = await fetch(`http://localhost:8000/api/projects`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return await response;
}