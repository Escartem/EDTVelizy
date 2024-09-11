"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			{children}
			<ProgressBar height="4px" color="#829cc2" shallowRouting />
		</>
	)
}

export default Providers;