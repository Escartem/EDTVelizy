export const maxDuration = 60;
import { urls } from "@/lib/utils";

function getMonday(d) {
	d = new Date(d)
	var day = d.getDay()
	var diff = d.getDate() - day + (day == 0 ? -6 : 1)
	return new Date(d.setDate(diff))
}

function convertDateTime(input) {
	return input.replace('T', ' ').slice(0, 16);
}

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	let date = searchParams.get("date");
	const group = searchParams.get("group").split("@");
	const week = searchParams.get("week");

	const url = urls[group[0]];

	// week mode
	let endDate, startDate
	if (week) {
		startDate = getMonday(date).toISOString().split('T')[0];
		endDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 6)).toISOString().split('T')[0];
	} else {
		startDate = date;
		endDate = date;
	}

	// a moi l'edt
	const res = await fetch(`https://${url}/Home/GetCalendarData`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"Accept": "application/json, text/javascript, */*; q=0.01"
		},
		body: `start=${startDate}&end=${endDate}&resType=${group[2]}&calView=agendaDay&federationIds%5B%5D=${group[1]}&colourScheme=3`
	})
	.catch(error => {return new Response(error)})

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

	for (const event of events) {
		let meta = event.description.replaceAll("\r\n", "").split("<br />")

		calendar.push({
			id: event.id,
			title: group[0] == "VEL" ? meta[3] : meta[2].split(" - ")[1],
			people: group[0] == "VEL" ? [meta[0]] : ["Aucun prof"],
			location: group[0] == "VEL" ? meta[2] : meta[1],
			calendarId: colors[event.eventCategory],
			start: convertDateTime(event.start),
			end: convertDateTime(event.end),
			full: 0
		});
	}

	return new Response(JSON.stringify(calendar));
}
