export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const group = searchParams.get("group");

    const urls = {
		"VEL": "edt.iut-velizy.uvsq.fr",
		"VER": "edt.uvsq.fr"
	}

	const url = urls[group.split("@")[0]];

    // fetch resultats
    const res = await fetch(`https://${url}/Home/ReadResourceListItems?myResources=false&searchTerm=${query}&pageSize=50&pageNumber=1&resType=103&_=1726049631178`, {
        method: "GET",
        headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Access-Control-Allow-Origin": "*"
        },
    })

    const data = await res.json()

    return new Response(JSON.stringify(data["results"]))
}