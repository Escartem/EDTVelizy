"use client";

import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewDay, createViewWeek } from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from 'react';
import { createEventsServicePlugin } from '@schedule-x/events-service'
import NProgress from 'next-nprogress-bar';
import { createEventModalPlugin } from '@schedule-x/event-modal'

export default function Calendar({group}: {group: string}) {
	const eventsServicePlugin = createEventsServicePlugin();
	const [eventsService, setEventsService] = useState<any>();
	const [curDate, setCurDate] = useState(new Date().toISOString().slice(0, 10));
	const [fullSchedule, setFullSchedule] = useState<any>({});
	const curGroup = group;

	// attente plugin
	useEffect(() => {
		// events service fait des trucs bizare ou il est défini quand il a envie donc c'est la seule solution que j'ai trouvé
		const checkFacadeInterval = setInterval(() => {
			if (eventsServicePlugin.eventsFacade) {
				setEventsService(eventsServicePlugin);
				clearInterval(checkFacadeInterval);
			}
		}, 100);

		return () => clearInterval(checkFacadeInterval);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// fetch cours
	useEffect(() => {
		if (eventsService) {
			NProgress.startProgress()

			const updateSchedule = async () => {
				const data = await fetch(`/api/getCalendar?date=${curDate}&group=${curGroup}&week=true`)
				const infos = await data.json()
				var tempFullSchedule = fullSchedule

				for (const event of infos) {
					if (tempFullSchedule[event.id] === undefined) {
						tempFullSchedule[event.id] = event
					}
				}

				setFullSchedule(tempFullSchedule)
				eventsService.set(Object.values(fullSchedule))
	
				for (let i = 0; i < infos.length; i++) {
					const event = fullSchedule[infos[i].id]

					if (event.full == 1) {
						continue
					}

					let newInfos: any = await fetch(`/api/getEvent?id=${event.id}&loc=${group.split("@")[0]}`)
	
					newInfos = await newInfos.json()
					const newEvent = {
						id: event.id,
						title: newInfos.title,
						people: newInfos.people,
						start: event.start,
						end: event.end,
						calendarId: event.calendarId,
						location: newInfos.location,
						full: 1
					}
					tempFullSchedule[event.id] = newEvent
					setFullSchedule(tempFullSchedule)
					eventsService.set(Object.values(fullSchedule))
				}
	
				NProgress.stopProgress()
			}

			updateSchedule()
		}
	}, [curDate, curGroup, eventsService]);

	// config du calendrier
	const calendar = useNextCalendarApp({
		locale: "fr-FR",
		isDark: true,
		dayBoundaries: {
			start: "08:00",
			end: "18:00",
		},
		views: [createViewDay(), createViewWeek()],
		plugins: [eventsServicePlugin, createEventModalPlugin()],
		events: [],
		calendars: {
			yellow: {
				colorName: 'yellow',
			  	darkColors: {
					main: '#fff5c0',
					onContainer: '#fff5de',
					container: '#a29742',
				},
			},
			red: {
			  	colorName: 'red',
				darkColors: {
					main: '#ffc0cc',
					onContainer: '#ffdee6',
					container: '#a24258',
				},
			},
			blue: {
				colorName: 'blue',
				darkColors: {
					main: '#c0dfff',
					onContainer: '#dee6ff',
					container: '#426aa2',
				},
			},
			purple: {
				colorName: 'purple',
				darkColors: {
					main: '#6750a4',
					onContainer: '#eaddff',
					container: '#21005e',
				},
			},
		},
		weekOptions: {
			gridHeight: window.innerHeight, // 192
			showLocation: true,
			nDays: 5
		},
		isResponsive: true,
		callbacks: {
			onRangeUpdate(range) {
				setEventsService(eventsServicePlugin.eventsFacade)
				setCurDate(range.start.split(" ")[0])
			}
		}
	})

	return (
		<div className="w-full h-[calc(100%-30px)]">
			<ScheduleXCalendar calendarApp={calendar} />
		</div>
	);
}
