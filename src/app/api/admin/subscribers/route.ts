import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthenticatedFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: subscribers, error } = await supabaseAdmin
    .from("subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get stats
  const stats = {
    total: subscribers?.length || 0,
    active: subscribers?.filter((s) => s.active && s.confirmed).length || 0,
    pending: subscribers?.filter((s) => s.active && !s.confirmed).length || 0,
    unsubscribed: subscribers?.filter((s) => !s.active).length || 0,
  };

  return NextResponse.json({ subscribers, stats });
}
