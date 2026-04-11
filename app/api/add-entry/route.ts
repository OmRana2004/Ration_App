import { prisma } from "@/db/index";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, unit, cardType } = body;

        const entry = await prisma.entry.create({
            data: {
                name,
                unit: Number(unit),
                cardType,
            }
        });

        return Response.json(entry);
    } catch (error) {
        return Response.json(
            { error: "Something went wrong"},
            { status: 500}
        );
    }
}