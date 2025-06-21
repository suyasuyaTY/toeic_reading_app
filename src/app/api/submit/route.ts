import { NextRequest, NextResponse } from "next/server";
import { SubmissionPayload } from "@/types";

// CORSを許可するためのヘッダー
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// 解答状況の取得リクエストをGASにプロキシする
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gasUrl = searchParams.get("gasUrl");

  if (!gasUrl) {
    return NextResponse.json({ error: "GAS URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(gasUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GAS GET Error:", errorText);
      return NextResponse.json(
        { error: `GAS server responded with status ${response.status}` },
        { status: response.status, headers: corsHeaders }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    console.error("Proxy GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from GAS" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// 解答結果のPOSTリクエストをGASにプロキシする
export async function POST(request: NextRequest) {
  try {
    const { payload, gasUrl } = (await request.json()) as {
      payload: SubmissionPayload;
      gasUrl: string;
    };

    if (!gasUrl || !payload) {
      return NextResponse.json(
        { error: "GAS URL and payload are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // GAS Web AppへPOSTリクエストを転送
    const response = await fetch(gasUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      // GASのPOSTはリダイレクトを返すことがあるため、リダイレクトを追わない設定
      redirect: "follow",
    });

    // GAS側からのレスポンスをそのままクライアントに返す
    const responseData = await response.json();

    return NextResponse.json(
      { success: true, gasResponse: responseData },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
