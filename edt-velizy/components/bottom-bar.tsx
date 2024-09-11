"use client";

import { Button } from "@/components/ui/button"
import { useRouter } from "next-nprogress-bar";
import { useEffect, useState } from "react";

export default function BottomBar() {
    const router = useRouter();
    const [group, setGroup] = useState<string | null>(null);

    useEffect(() => {
        setGroup(window?.localStorage?.getItem("group"));
    })

    const updateGroup = () => {
        window?.localStorage?.removeItem("group");
        router.push("/");
    }

    return (
        <div className="h-[30px] bg-slate-900 w-full flex items-center justify-evenly">
            <Button onClick={() => {updateGroup()}} className="text-white" variant="link">{`Changer de groupe (${group?.split("@")[1]})`}</Button>
            <Button onClick={() => {window.open("https://github.com/Escartem/EDTVelizy", "_blank")}} className="text-white" variant="link">GitHub</Button>
            <Button disabled={true} className="text-white" variant="link">Activer les notifications</Button>
        </div>
    )
}