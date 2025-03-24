"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function GlobalPopup() {
	const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
		!["edt.escartem.moe", "didactic-space-lamp-ppj756jp5rgf769x-3000.app.github.dev"].includes(window.document.location.host) && setPopupOpen(true);
	}, []);

	return (
        <div className="z-[10]">
            <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Changement de domaine !</DialogTitle>
                        <DialogDescription>
                            <br />
                            Le domaine du site va changer de edt.escartem.eu.org à <a href={"https://edt.escartem.moe"} target="_blank" className={`underline transition text-dark-300 hover:text-dark-100`}>edt.escartem.moe</a>.
                            Merci de mettre à jour les liens que vous avez enregistrés.
                            <br /><br />
                            L'ancien domaine restera disponible jusqu'au 1er mai 2025.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => {setPopupOpen(false)}}>Fermer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
	)
}