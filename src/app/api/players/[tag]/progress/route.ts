import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { tag: string } }
) {
  const { tag } = params;
  console.log("✅ API called with tag:", tag);

  try {
    const res = await fetch(`http://localhost:8081/api/players/${tag}/progress`);
    if (!res.ok) {
      console.error("❌ Backend error", res.status);
      return NextResponse.json({ error: "Backend error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Proxy error", err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}
