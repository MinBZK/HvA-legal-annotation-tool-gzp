// POST METHODS

export async function uploadXML(xmlContent: String, title: String, selectedArticles: any) {
    const response = await fetch(`${process.env.API_URL}/saveXml`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "xml_content": xmlContent,
            "title": title,
            "selectedArticles": selectedArticles
        }),
    });

    return response;
}

// GET METHODS

export async function getProjects() {
    const response = await fetch(`${process.env.API_URL}/projects`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

export async function getProjectById(id: number) {
    const response = await fetch(`${process.env.API_URL}/project/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

export async function getMaxXmlCount() {
    const response = await fetch(`${process.env.API_URL}/maxXmlCount`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

export async function getProjectCounts() {
    const response = await fetch(`${process.env.API_URL}/projectCounts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}