// POST METHODS

export async function getChildAnnotationsFromParentId(id: Number) {
  const response = await fetch(`${process.env.API_URL}/annotations/children/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}
