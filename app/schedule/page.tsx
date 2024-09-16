"use client";

import BottomBar from "@/components/bottom-bar";
import Calendar from "@/components/calendar"
import { useRouter } from "next-nprogress-bar";
import { useEffect, useState } from "react";

export default function Schedule() {
    const router = useRouter();
    const [group, setGroup] = useState<string | null>(null);
    const [groupLoaded, setGroupLoaded] = useState<boolean>(false);

    // get group
    useEffect(() => {
		setGroup(window?.localStorage?.getItem("group"));
        setGroupLoaded(true);
	}, [])

    // aucun groupe, on retourne a l'accueil
    useEffect(() => {
		if (!group && groupLoaded) {
			router.push("/");
		}
	}, [group, groupLoaded, router])

    return (
        <div className="h-full w-full flex flex-col items-center justify-center overflow-hidden">
            {group ? (
                <>
                    <Calendar group={group} />
                    <BottomBar />
                </>
            ) : (
                <></>
            )}
        </div>
    )
}