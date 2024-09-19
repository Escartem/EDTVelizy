"use client";

import { Button } from "@/components/ui/button"
import { useRouter } from "next-nprogress-bar";

export default function BottomBar({group}: {group: string}) {
	const router = useRouter();

	return (
		<div className="h-[30px] bg-slate-900 w-full flex items-center justify-evenly">
			<Button onClick={() => {router.push("/")}} className="text-white" variant="link">
				<span className="hidden md:block">{`Changer de groupe (${group?.split("@")[1]})`}</span>
				<span className="block md:hidden">Changer le groupe</span>
			</Button>
			<Button onClick={() => {window.open("https://github.com/Escartem/EDTVelizy", "_blank")}} className="text-white" variant="link">GitHub</Button>
			{/* <Button disabled={true} className="text-white" variant="link">Activer les notifications</Button> */}
		</div>
	)
}