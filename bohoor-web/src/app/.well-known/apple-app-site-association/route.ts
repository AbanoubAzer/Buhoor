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
          ],
          components: [
            {
              "/": "/units/*",
              comment: "Matches unit pages"
            },
            {
              "/": "/projects/*",
              comment: "Matches project pages"
            },
            {
              "/": "/unit/*",
              comment: "Matches singular unit pages"
            },
            {
              "/": "/project/*",
              comment: "Matches singular project pages"
            }
          ]
        }
      ]
    },
    webcredentials: {
      apps: ["TEAM_ID.com.bohoor.app"]
    }
  };

  return NextResponse.json(data, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
