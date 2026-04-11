import { prisma } from "@/db/index";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let where: any = {};

    if (from && to) {
      // FIX: manually build date range (no timezone issue)
      const fromDate = new Date(`${from}T00:00:00.000Z`);
      const toDate = new Date(`${to}T23:59:59.999Z`);

      where.createdAt = {
        gte: fromDate,
        lte: toDate,
      };
    }

    const entries = await prisma.entry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return Response.json(entries);

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}