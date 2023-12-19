// POST METHODS

export async function uploadXML(xmlContent: String, title: String) {
    const response = await fetch(`http://localhost:8000/api/saveXml`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "xml_content": xmlContent,
            "title": title
        }),
    });

    return response;
}

// GET METHODS

export async function getProjects() {
    const response = await fetch(`http://localhost:8000/api/projects`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

export async function getProjectById(id: number) {
    const response = await fetch(`http://localhost:8000/api/project/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

export async function getMaxXmlCount() {
    const response = await fetch(`http://localhost:8000/api/maxXmlCount`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

export async function getProjectCounts() {
    const response = await fetch(`http://localhost:8000/api/projectCounts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}