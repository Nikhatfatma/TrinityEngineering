import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const catalystUrl = process.env.NEXT_PUBLIC_CATALYST_FUNCTION_URL;

    if (!catalystUrl) {
      return NextResponse.json(
        { success: false, error: 'Catalyst Function URL is not configured' },
        { status: 500 }
      );
    }

    // Extract action from query params or body
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || body.action || 'submitInspection';

    // Construct the final Catalyst URL with the action parameter
    const finalUrl = new URL(catalystUrl);
    finalUrl.searchParams.set('action', action);

    // Forward the request to Catalyst
    const response = await fetch(finalUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    let data = await response.json();

    // UNWRAP Catalyst BasicIO output if it's wrapped in { output: "{...}" }
    if (data.output && typeof data.output === 'string') {
      try {
        data = JSON.parse(data.output);
      } catch (e) {
        // Fallback if output is not JSON
      }
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Proxy Error' },
      { status: 500 }
    );
  }
}

