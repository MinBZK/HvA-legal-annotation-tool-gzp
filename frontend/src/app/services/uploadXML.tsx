// /services/xml
'use server'

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

  // Log the server response
  const result = await response.json();
  console.log(result);

  return result;
}
