import { encrypt } from "@/lib/secureLogin";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    let login = searchParams.get("login");

    if (login === null) {
        return new Response("Missing login", { status: 400 });
    }

    const encReq = encrypt(atob(login));

    return new Response(JSON.stringify({"login": encReq}));
}