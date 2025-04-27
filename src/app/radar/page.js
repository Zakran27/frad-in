'use client'
export const dynamic = "force-dynamic"

import { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '150px'
}

const defaultCenter = {
  lat: 48.8566,
  lng: 2.3522
}

const emojiByCuisine = {
  italian: '🍕',
  japanese: '🍣',
  chinese: '🥡',
  thai: '🍜',
  indian: '🍛',
  french: '🥖',
  mexican: '🌮',
  burger: '🍔',
  pizza: '🍕',
  sushi: '🍣',
  kebab: '🥙',
  chicken: '🍗',
  steakhouse: '🥩'
}

export default function RestaurantRadar() {
  const [userLocation, setUserLocation] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [minRating, setMinRating] = useState(0)
  const [ratingChanged, setRatingChanged] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  })

  useEffect(() => {
    if (!isLoaded) return

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
        setUserLocation(coords)
        fetchNearbyRestaurants(coords, minRating, page)
      },
      (err) => {
        console.error('Geolocation error:', err)
        setUserLocation(defaultCenter)
        fetchNearbyRestaurants(defaultCenter, minRating, page)
      }
    )
  }, [isLoaded, page])

  const inferCuisine = (place) => {
    const lower = place.title?.toLowerCase() || ""
    if (lower.includes("pizza")) return "pizza"
    if (lower.includes("sushi")) return "sushi"
    if (lower.includes("burger")) return "burger"
    if (lower.includes("taco") || lower.includes("mexic")) return "mexican"
    if (lower.includes("kebab")) return "kebab"
    if (lower.includes("thai")) return "thai"
    if (lower.includes("chinese")) return "chinese"
    if (lower.includes("indian") || lower.includes("curry")) return "indian"
    if (lower.includes("italian") || lower.includes("pasta")) return "italian"
    if (lower.includes("japan")) return "japanese"
    if (lower.includes("steak") || lower.includes("grill")) return "steakhouse"
    if (lower.includes("chicken") || lower.includes("poulet")) return "chicken"
    return place.category?.toLowerCase() || "restaurant"
  }

  const fetchNearbyRestaurants = async (coords, ratingThreshold, currentPage) => {
    setLoading(true)
    const { lat, lng } = coords

    try {
      const response = await fetch(`/api/places-proxy?lat=${lat}&lng=${lng}&page=${currentPage}`)
      const data = await response.json()

      if (data.error) {
        console.error('Places API error:', data.error)
        return
      }

      const results = (data.local_results || []).map(place => {
        const coords = place.gps_coordinates || place.coordinates || {}
        return {
          ...place,
          coordinates: {
            latitude: coords.latitude || coords.lat,
            longitude: coords.longitude || coords.lng
          }
        }
      })

      const filtered = results.filter(place => {
        const name = place.title?.toLowerCase() || ""
        const rating = place.rating || 0
        const blacklist = ["hotel", "boulangerie", "carrefour", "flunch", "casino", "supermarché"]
        const isBlacklisted = blacklist.some(bad => name.includes(bad))

        return !isBlacklisted && rating >= ratingThreshold && place.coordinates.latitude && place.coordinates.longitude
      })

      if (currentPage === 1) {
        setRestaurants(filtered)
      } else {
        setRestaurants(prev => [...prev, ...filtered])
      }

      setHasMore(filtered.length >= 20)
      setRatingChanged(false)
    } catch (error) {
      console.error('Failed to fetch restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilter = () => {
    if (userLocation) {
      setPage(1)
      fetchNearbyRestaurants(userLocation, minRating, 1)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading restaurants...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="py-12 px-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-6">🍜 Restaurant Radar</h1>

      {/* Filter */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <label className="block text-sm text-gray-300 mb-2 sm:mb-0">
          Minimum rating: {minRating.toFixed(1)} ⭐
        </label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={minRating}
          onChange={(e) => {
            setMinRating(parseFloat(e.target.value))
            setRatingChanged(true)
          }}
          className="w-full sm:w-64 accent-blue-500"
        />
        {ratingChanged && (
          <button
            onClick={handleApplyFilter}
            className="mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded"
          >
            Apply Filter
          </button>
        )}
      </div>

      {/* List of restaurants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((place, idx) => {
          const cuisine = inferCuisine(place)
          const emoji = emojiByCuisine[cuisine] || "🍽️"

          return (
            <div
              key={idx}
              className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:bg-gray-800 transition flex flex-col"
            >
              {/* Mini Map */}
              <div className="h-[150px] w-full relative">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={{
                    lat: place.coordinates.latitude,
                    lng: place.coordinates.longitude
                  }}
                  zoom={15}
                >
                  <Marker
                    position={{
                      lat: place.coordinates.latitude,
                      lng: place.coordinates.longitude
                    }}
                  />
                </GoogleMap>
              </div>

              {/* Info */}
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-lg font-bold">{place.title}</p>
                  <p className="text-gray-400 text-sm">{place.address}</p>

                  {place.rating && (
                    <p className="text-yellow-400 text-sm mb-1">
                      {'⭐'.repeat(Math.floor(place.rating))} ({place.rating})
                    </p>
                  )}

                  <p className="text-gray-400 text-xs italic mb-2">
                    {emoji} {cuisine}
                  </p>

                  {place.description && (
                    <p className="text-gray-500 text-xs">{place.description}</p>
                  )}
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${place.coordinates.latitude},${place.coordinates.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm mt-4 inline-block hover:underline"
                >
                  📍 Get Itinerary
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
          >
            Load more
          </button>
        </div>
      )}
    </main>
  )
}
