import { NextRequest, NextResponse } from "next/server";

interface IpApiResponse {
  status: string;
  country?: string;
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  isp?: string;
  query?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");
  const forceIp = searchParams.get("detectIp") === "true";

  let lat = latParam ? parseFloat(latParam) : null;
  let lon = lonParam ? parseFloat(lonParam) : null;
  let isIpFallback = false;

  // Step 1: If coordinates are not provided by client, or IP fallback is forced, query real-time IP Geolocation
  let ipData: IpApiResponse | null = null;
  if (forceIp || lat === null || lon === null || isNaN(lat) || isNaN(lon)) {
    try {
      const forwarded = req.headers.get("x-forwarded-for");
      const realIp = req.headers.get("x-real-ip");
      const candidateIp = forwarded?.split(",")[0]?.trim() || realIp || "";
      const isLoopback =
        !candidateIp ||
        candidateIp === "127.0.0.1" ||
        candidateIp === "::1" ||
        candidateIp.startsWith("192.168.") ||
        candidateIp.startsWith("10.");

      const ipApiUrl = isLoopback
        ? "http://ip-api.com/json"
        : `http://ip-api.com/json/${candidateIp}`;

      const ipRes = await fetch(ipApiUrl, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (ipRes.ok) {
        const data: IpApiResponse = await ipRes.json();
        if (data.status === "success") {
          ipData = data;
          if (data.lat && data.lon) {
            lat = data.lat;
            lon = data.lon;
            isIpFallback = true;
          }
        }
      }
    } catch (ipErr) {
      console.warn("IP Geolocation lookup error:", ipErr);
    }
  }

  // Step 2: Reverse-geocode coordinates via OpenStreetMap Nominatim
  if (lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`;
      const res = await fetch(osmUrl, {
        headers: {
          "User-Agent": "VeyroEcommerce/2.0 (support@veyro.in)",
          Accept: "application/json",
        },
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};

        const city =
          addr.city ||
          addr.town ||
          addr.municipality ||
          addr.village ||
          addr.city_district ||
          addr.state_district ||
          addr.county ||
          "";

        const state = addr.state || "";
        const pincode = (addr.postcode || "").replace(/\D/g, "").slice(0, 6);

        const road = addr.road || addr.street || addr.pedestrian || addr.footway || "";
        const suburb =
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.quarter ||
          addr.village ||
          "";
        const building = addr.building || addr.house_name || addr.house_number || "";
        const streetParts = [building, road, suburb].filter(Boolean);
        const street =
          streetParts.length > 0
            ? streetParts.join(", ")
            : suburb || road
            ? `${road || suburb}, ${city}`
            : city
            ? `Central Area, ${city}`
            : data.name || data.display_name?.split(",").slice(0, 2).join(",") || "";

        if (city || state || pincode) {
          return NextResponse.json({
            success: true,
            street,
            suburb: suburb || city,
            city,
            state,
            pincode,
            displayName: data.display_name,
            latitude: lat,
            longitude: lon,
            source: isIpFallback ? "network_ip" : "live_gps",
          });
        }
      }
    } catch (osmErr) {
      console.warn("Nominatim reverse geocode error:", osmErr);
    }
  }

  // Step 3: Direct IP Telemetry Fallback if Nominatim failed or returned sparse data
  if (ipData?.status === "success") {
    const city = ipData.city || "";
    const state = ipData.regionName || "";
    const pincode = (ipData.zip || "").replace(/\D/g, "").slice(0, 6);

    return NextResponse.json({
      success: true,
      street: city ? `Central Area, ${city}` : "",
      suburb: city,
      city,
      state,
      pincode,
      displayName: `${city}, ${state}, ${ipData.country || ""}`.replace(/^,\s*/, ""),
      latitude: ipData.lat || lat || 0,
      longitude: ipData.lon || lon || 0,
      source: "network_ip",
    });
  }

  return NextResponse.json(
    {
      error: "Unable to resolve current location telemetry",
      fallback: true,
    },
    { status: 500 }
  );
}
