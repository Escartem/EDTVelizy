import { decode } from "he";

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	let date = searchParams.get("date");
	const group = searchParams.get("group");
	const week = searchParams.get("week");

	const urls = {
		"VEL": "edt.iut-velizy.uvsq.fr",
		"VER": "edt.uvsq.fr"
	}

	const url = urls[group.split("@")[0]];

	// week mode
	let endDate
	if (week) {
		const temp = new Date(date);
		let day = temp.getDay();
		let diff = temp.getDate() - day + (day == 0 ? -6 : 1);
		date = new Date(diff).toISOString().split('T')[0];
		temp.setDate(diff + 7)
		endDate = temp.toISOString().split('T')[0];
	} else {
		endDate = date;
	}

	// a moi l'edt
	const res = await fetch(`https://${url}/Home/GetCalendarData`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"Accept": "application/json, text/javascript, */*; q=0.01"
		},
		body: `start=${date}&end=${endDate}&resType=103&calView=agendaDay&federationIds%5B%5D=${group.split("@")[1]}&colourScheme=3`
	});

	// blue red yellow purple
	const colors = {
		"Travaux Dirigés (TD)": "blue",
		"Travaux Pratiques (TP)": "purple",
		"Cours Magistraux (CM)": "red",
		"CM": "blue",
		"Réunion": "purple",
		"TD": "yellow"
	}

	const events = await res.json();
	let calendar = [];

	// refetch chaque cours
	for (const event of events) {
		const res = await fetch(`https://${url}/Home/GetSideBarEvent`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				"Accept": "application/json, text/javascript, */*; q=0.01"
			},
			body: `eventId=${event.id}`
		})

		let meta = await res.json()

		// return new Response(JSON.stringify(meta));
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

		calendar.push({
			id: event.id,
			title: decode((meta.Module ? meta.Module : meta.Modules) || "Aucun nom"),
			people: meta.Staff ? meta.Staff.split(", ") : ["Aucun prof"],
			start: convertDateTime(event.start),
			end: convertDateTime(event.end),
			calendarId: colors[event.eventCategory],
			location: meta.Room
		});
	}

	return new Response(JSON.stringify(calendar));
}

function convertDateTime(input) {
	return input.replace('T', ' ').slice(0, 16);
}
