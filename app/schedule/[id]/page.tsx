"use client";

import BottomBar from "@/components/bottom-bar";
import Calendar from "@/components/calendar"

export default function Schedule({params}: {params: {id: string}}) {
	const group = atob(params.id);

	return (
		<div className="h-full w-full flex flex-col items-center justify-center overflow-hidden">
			{group ? (
				<>
					<Calendar group={group} />
					<BottomBar group={group} />
				</>
			) : (
				<></>
			)}
		</div>
	)
}