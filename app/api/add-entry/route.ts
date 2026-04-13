import { prisma } from "@/db/index";

async function createEntryWithRetry(data: any, retries = 3) {
  try {
    return await prisma.entry.create({ data });
  } catch (err: any) {
    if (retries > 0 && err.code === "P1001") {
      console.log("DB sleeping... retrying");
      await new Promise((res) => setTimeout(res, 1000));
      return createEntryWithRetry(data, retries - 1);
    }
    throw err;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY:", body);

    const { name, unit, cardType } = body;

    if (!name || !unit || !cardType) {
      return Response.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const entry = await createEntryWithRetry({
      name,
      unit: Number(unit),
      cardType,
    });

    return Response.json(entry);

  } catch (error) {
    console.error("ADD ERROR:", error);

    return Response.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}