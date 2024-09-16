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
	const [group, setGroup] = useState<string | null>(null);
	const [groupLoaded, setGroupLoaded] = useState<boolean>(false);
	const [query, setQuery] = useState<string | null>(null);
	const [results, setResults] = useState<{[key: string]: string}[]>([]);
	const [loc, setLoc] = useState<string>("VEL");

	// recup groupe
	useEffect(() => {
		setGroup(window?.localStorage?.getItem("group"));
		setGroupLoaded(true);
	}, [])

	// groupe deja defini
	useEffect(() => {
		if (group && groupLoaded) {
			router.push("/schedule");
		}
	}, [router, group, groupLoaded])

	const updateGroup = (group: [string, string]) => {
		const curGroup = group.join("@");
		window?.localStorage?.setItem("group", curGroup);
		setGroup(curGroup);
	}

	// recherche de groupe
	const handleQuery = (value: string) => {
		setQuery(value);
	}

	useEffect(() => {
		const getResults = async () => {
			const res = await fetch(`/api/getGroups?query=${query}&group=${loc}`);
			const data = await res.json();
			setResults(data);
		}

		if (query) {
			getResults();
		}
	}, [loc, query])

	const debouncedHandleInputChange = debounce(handleQuery, 500);

	return (
		<div className="h-full w-full flex items-center justify-center overflow-hidden">
			{groupLoaded ? (
				<>
					<div className="w-[80%] h-[80%] flex flex-col items-center justify-evenly border-2 border-gray-700 p-2 rounded-xl text-center">
						<div className="flex flex-col">
							<span className="text-xl">L&apos;emploi du temps celcat en ligne. Pas grand chose de plus, séléction du groupe juste en dessous.</span>
							<span className="text-md">L&apos;emploi du temps sera sauvegardé dans le navigateur et mis à jour automatiquement.</span>
						</div>

						<div className="flex w-full justify-evenly">
							<Select defaultValue="VEL" onValueChange={(e) => {setLoc(e)}}>
								<SelectTrigger className="w-[180px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="VEL">Vélizy</SelectItem>
										<SelectItem value="VER">Versailles</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>

							<Popover>
								<PopoverTrigger>
									<Button variant="outline" role="combobox" className="text-md">
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
															<CommandItem key={result.id} onSelect={() => {updateGroup([loc, result.id])}}>
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
				</>
			) : (
				<></>
			)}
		</div>
	);
}
