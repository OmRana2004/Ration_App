import { prisma } from "@/db/index";

async function fetchEntries(where: any, retries = 3) {
  try {
    return await prisma.entry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  } catch (err: any) {
    if (retries > 0) {
      console.log("DB sleeping... retrying");

      await new Promise((res) => setTimeout(res, 2000));

      return fetchEntries(where, retries - 1);
    }

    throw err;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let where: any = {};

    if (from && to) {
      where.createdAt = {
        gte: new Date(`${from}T00:00:00.000Z`),
        lte: new Date(`${to}T23:59:59.999Z`),
      };
    }

    const entries = await fetchEntries(where);

    return Response.json(entries);

  } catch (error) {
    console.error("FINAL DB FAIL:", error);

    // never break UI
    return Response.json([], { status: 200 });
  }
}