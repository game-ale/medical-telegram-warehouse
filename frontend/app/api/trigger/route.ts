import { api } from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const result = await api.triggerPipeline();
        return NextResponse.json(result);
    } catch (e) {
        return NextResponse.json({ error: "Failed to trigger" }, { status: 500 });
    }
}
