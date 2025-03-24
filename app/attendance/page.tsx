"use client";
import { useEffect, useState } from 'react';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from "lucide-react";

function formatHour(hour: string) {
    const [hours, minutes] = hour.split(".").map(Number);
    return minutes ? `${hours}h30` : `${hours}h`;
}

export default function Attendance() {
    const [data, setData] = useState<any>(null);

    const [status, setStatus] = useState(0); // need login, fetching, done, error

    const [userID, setUserID] = useState("");
    const [password, setPassword] = useState("");

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const fetchAttendance = async () => {
        setStatus(1);
        const login = `${userID}@${password}`
        const response = await fetch(`/api/getAttendance?login=${btoa(login)}`);
        const result = await response.json();
        await fetchData(result.login);
    }

    const fetchData = async (login: string) => {
        try {
            const response = await fetch(`https://api.escartem.moe/p/edt/attendance?login=${login}`);
        
            if (!response.ok) {
                setStatus(3);
                return;
            }
        
            const result = await response.json();
            setData(result);
            setStatus(2);
        } catch (error) {
            setStatus(3);
        }
    };

    return (
        <>
        <div className="h-full w-full flex items-center justify-center overflow-hidden">
			<div className="w-[80%] h-[80%] flex flex-col items-center justify-evenly border-2 border-gray-700 p-2 rounded-xl text-center">
                {(status == 0 || status == 3) && (
                    <>
                        <div>
                            <h1 className="font-bold">Connexion requise pour voir les absences / retards</h1>
                            <span className="text-gray-500">Les identifiants seront uniquement utilisés afin de récupérer les informations, la session est détruite immédiatement après</span>
                        </div>
                        
                        <Input type="text" placeholder="Numéro étudiant" onChange={(e: any) => setUserID(e.target.value)} />
                        <Input type="password" placeholder="Mot de passe" onChange={(e: any) => setPassword(e.target.value)} />

                        {status == 3 && (
                            <span className="text-red-300">Impossible de charger les données, vérifiez votre id utilisateur / mot de passe</span>
                        )}

                        <Button variant={"outline"} onClick={() => fetchAttendance()}>Valider</Button>
                    </>
                )}

                {status == 1 && (
                    <div className="flex items-center">
                        <Loader2 className={`mr-4 transition animate-spin text-dark-300`}></Loader2>
                        <p className="text-3xl">Chargement...</p>
                    </div>
                )}

                {status == 2 && (
                    <div className="w-full h-full overflow-y-auto">
                        <Table className="mb-5">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Durée</TableHead>
                                    <TableHead>Prof</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Justifié</TableHead>
                                </TableRow>
                            </TableHeader>

                            <>
                                {data && (
                                    <TableBody>
                                        {Object.keys(data["absences"]).map(date => (
                                            <>
                                                {data["absences"][date].map((absence: any) => (
                                                    <>
                                                        {(absence.statut != "present") && (
                                                            <TableRow className="hover:bg-dark-800" key={date}>
                                                                <TableCell>{capitalize(new Date(date).toLocaleDateString("fr-FR", {year: "numeric", month: "long", day: "numeric", weekday: "long"}))}</TableCell>
                                                                <TableCell>De {formatHour(absence.debut.toString())} à {formatHour(absence.fin.toString())}</TableCell>
                                                                <TableCell>{absence.enseignant}</TableCell>
                                                                <TableCell>{capitalize(absence.statut)}</TableCell>
                                                                <TableCell>{absence.justifie ? 'Oui' : 'Non'}</TableCell>
                                                            </TableRow>
                                                        )}
                                                    </>
                                                ))}
                                            </>
                                        ))}
                                    </TableBody>
                                )}
                            </>
                        </Table>
                    </div>
                )}
            </div>
        </div>
        </>
    )
}