import { NextResponse } from 'next/server';

export async function GET() {
  const data = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.bohoor.app",
        sha256_cert_fingerprints: [
          "14:6D:E9:7D:0C:52:AB:71:04:78:E8:4F:9D:69:4F:8D:1C:CE:8B:2A:8C:38:A2:8B:4A:27:0B:5F:B6:5D:5C:8B"
        ]
      }
    }
  ];

  return NextResponse.json(data, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
