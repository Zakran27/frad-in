export const runtime = 'nodejs'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const page = parseInt(searchParams.get('page') || '1')

  if (!lat || !lng) {
    return new Response(JSON.stringify({ error: 'Missing lat/lng parameters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const serpApiKey = process.env.NEXT_PUBLIC_SERPAPI_KEY
  const start = (page - 1) * 20 // 20 results per page

  const url = `https://serpapi.com/search.json?engine=google_maps&ll=@${lat},${lng},15z&type=search&q=restaurant&start=${start}&api_key=${serpApiKey}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), { status: 500 })
    }

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
