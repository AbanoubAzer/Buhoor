import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    applinks: {
      apps: [],
      details: [
        {
          appID: "TEAM_ID.com.bohoor.app",
          paths: [
            "/units/*",
            "/projects/*",
            "/unit/*",
            "/project/*"
          ]
        }
      ]
    }
  };

  return NextResponse.json(data, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
