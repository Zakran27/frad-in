// src/app/api/places-proxy/route.js
export const runtime = 'nodejs' // Désactive Edge runtime (important pour fetch externe)

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  if (!lat || !lng) {
    return new Response(JSON.stringify({ error: 'Missing lat/lng parameters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=restaurant&key=${apiKey}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
