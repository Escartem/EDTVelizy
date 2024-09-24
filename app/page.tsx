"use client";

import { useRouter } from "next-nprogress-bar";
import { useEffect, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import debounce from "@/lib/debounce";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
	const router = useRouter();
	const [query, setQuery] = useState<string | null>(null);
	const [results, setResults] = useState<{[key: string]: string}[]>([]);
	const [loc, setLoc] = useState<string>("VEL");
	const [resType, setResType] = useState<string>("103");

	const updateGroup = (group: [string, string, string]) => {
		const curGroup = btoa(group.join("@")).replaceAll("=", "");
		router.push(`/schedule/${curGroup}`);
	}

	// recherche de groupe
	useEffect(() => {
		const getResults = async () => {
			const res = await fetch(`/api/getGroups?query=${query}&loc=${loc}&room=${resType == "102" ? "true" : "false"}`);
			const data = await res.json();
			setResults(data);
		}

		if (query) {
			getResults();
		}
	}, [loc, query])

	const debouncedHandleInputChange = debounce(setQuery, 10);

	return (
		<div className="h-full w-full flex items-center justify-center overflow-hidden">
			<div className="w-[80%] h-[80%] flex flex-col items-center justify-evenly border-2 border-gray-700 p-2 rounded-xl text-center">
				<div className="flex flex-col text-white">
					<span className="text-xl">L&apos;emploi du temps celcat en ligne. Pas grand chose de plus, séléction du groupe juste en dessous.</span>
					<span className="text-md">L&apos;emploi du temps sera sauvegardé dans le navigateur et mis à jour automatiquement.</span>
				</div>

				<div className="flex w-full justify-evenly text-white flex-col items-center md:flex-row">
					<Select defaultValue="VEL" onValueChange={(e) => {setLoc(e)}}>
						<SelectTrigger className="w-[180px] m-2">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="VEL">Vélizy</SelectItem>
								<SelectItem value="VER">Versailles</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>

					<Select defaultValue="103" onValueChange={(e) => {setResType(e)}}>
						<SelectTrigger className="w-[180px] m-2">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="103">Groupe</SelectItem>
								<SelectItem value="102">Salle</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>

					<Popover>
						<PopoverTrigger>
							<Button variant="outline" role="combobox" className="text-md m-2 w-[180px]">
								Chercher un groupe
							</Button>
						</PopoverTrigger>
						<PopoverContent className="p-0 z-100">
							<Command shouldFilter={false}>
								<CommandInput placeholder="Recherche..." onValueChange={(e) => {debouncedHandleInputChange(e)}} />
								<CommandGroup>
									<CommandList>
										{results.length > 0 ? (
											<>
												{results.map((result: {[id: string]: string}) => (
													<CommandItem key={result.id} onSelect={() => {updateGroup([loc, result.id, resType])}}>
														{result.text}
													</CommandItem>
												))}
											</>
										) : (
											<CommandEmpty>Aucun résultat</CommandEmpty>
										)}
									</CommandList>
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</div>
	);
}
