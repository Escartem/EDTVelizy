import { decode } from "he";
import { urls } from "@/lib/utils";
export const maxDuration = 60;

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");
	const url = urls[searchParams.get("loc")];

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

	const result = [];

	// fusion des éléments sans label
	for (let i = 0; i < meta.elements.length; i++) {
        if (meta.elements[i].label === null) {
            if (result.length > 0) {
                result[result.length - 1].content += ", " + meta.elements[i].content;
            }
        } else {
            result.push({ ...meta.elements[i] });
        }
    }

	meta = result;

	const renames = {
		"Salle": "Room",
		"Rooms": "Room",
		"Elément pédagogique": "Module",
		"Modules": "Module",
		"Catégorie d'évènement": "eventCategory",
		"Remarques": "Remark",
		"Notes": "Remark",
	}

	// staff bizzare
	meta = meta.reduce((obj, x) => {
		if (renames[x.label]) {
			obj[renames[x.label]] = x.content
		} else {
			obj[x.label] = x.content
		}
		return obj
	}, {})

	return new Response(JSON.stringify({
		title: `${decode(meta.Module || "Aucun nom")}${meta.Remark ? ` (${meta.Remark.replaceAll("<br />", "")})` : ""}`,
		people: meta.Staff ? meta.Staff.split(", ") : ["Aucun prof"],
		location: meta.Room
	}))
}