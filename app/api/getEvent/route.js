import { decode } from "he";
export const maxDuration = 60;

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const loc = searchParams.get("loc");
	const id = searchParams.get("id");

	const urls = {
		"VEL": "edt.iut-velizy.uvsq.fr",
		"VER": "edt.uvsq.fr"
	}

	const url = urls[loc];

	const res = await fetch(`https://${url}/Home/GetSideBarEvent`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"Accept": "application/json, text/javascript, */*; q=0.01"
		},
		body: `eventId=${id}`
	})
	.catch(error => {return new Response(error)})

	let meta = await res.json();

	const renames = {
		"Salle": "Room",
		"Elément pédagogique": "Module",
		"Catégorie d'évènement": "eventCategory"
	}

	// staff bizzare
	meta = meta.elements.reduce((obj, x) => {
		if (!x.label) {
			obj["Staff"] = obj["Staff"] ? obj["Staff"] + ", " + x.content : x.content
		} else {
			if (renames[x.label]) {
				obj[renames[x.label]] = x.content
			} else {
				obj[x.label] = x.content
			}
		}
		return obj
	}, {})

	return new Response(JSON.stringify({
		title: decode((meta.Module ? meta.Module : meta.Modules) || "Aucun nom"),
		people: meta.Staff ? meta.Staff.split(", ") : ["Aucun prof"],
		location: meta.Room
	}))
}