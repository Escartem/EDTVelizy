import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ProgressProvider from "@/components/progress-provider";
import { ThemeProvider } from "@/components/theme-provider"
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "EDT Velizy",
	description: "Emploi du temps CELCAT amélioré",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					<ProgressProvider>
						{children}
					</ProgressProvider>
				</ThemeProvider>
			</body>

			<GoogleAnalytics gaId="G-HB97VBP32C" />
		</html>
	);
}
