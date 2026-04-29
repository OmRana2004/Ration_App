import { prisma } from "@/db/index";

async function createEntryWithRetry(data: any, retries = 3) {
  try {
    return await prisma.entry.create({ data });
  } catch (err: any) {
    console.log("DB ERROR:", err?.code || err?.message);

    // 🔥 retry for connection-related errors
    if (
      retries > 0 &&
      (err?.code === "P1001" || err?.message?.includes("Can't reach database"))
    ) {
      console.log("DB sleeping... retrying");

      await new Promise((res) => setTimeout(res, 1500));

      return createEntryWithRetry(data, retries - 1);
    }

    throw err;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, unit, cardType } = body;

    // Basic validation
    if (!name || !unit || !cardType) {
      return Response.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // ENUM validation
    const validTypes = ["SFY", "AAY", "PHH"];
    
    if (!validTypes.includes(cardType)) {
      return Response.json(
        { error: "Invalid card type" },
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
      { error: "Database temporarily unavailable" },
      { status: 500 }
    );
  }
}

// 🗑️ DELETE (ALL ENTRIES)

export async function DELETE() {
  try {
    const result = await prisma.entry.deleteMany({});

    return Response.json({
      message: "All entries deleted successfully",
      deletedCount: result.count,
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);

    return Response.json(
      { error: "Failed to delete entries" },
      { status: 500 }
    );
  }
}