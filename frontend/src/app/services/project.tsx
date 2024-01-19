// POST METHODS

export async function uploadXML(xmlContent: String, title: String, selectedArticles: any, id: number | undefined = undefined) {
    let body = JSON.stringify({
        xml_content: xmlContent,
        title: title,
        selectedArticles: selectedArticles
    });

    if (id) {
        body = JSON.stringify({
            id: id,
            xml_content: xmlContent,
            title: title,
            selectedArticles: selectedArticles
        })
    }
    const response = await fetch(`${process.env.API_URL}/saveXml`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
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

    return response;
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

export async function deleteProject(id: number) {
    const response = await fetch(`${process.env.API_URL}/project/${id}/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(id)
    });

    return response;
}