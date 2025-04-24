'use client'
export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '60vh'
}

const defaultCenter = {
  lat: 48.8566,
  lng: 2.3522
}

// Optional: simple mapping from type to emoji
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
  const [selectedPlaceId, setSelectedPlaceId] = useState(null)
  const [minRating, setMinRating] = useState(0)
  const [ratingChanged, setRatingChanged] = useState(false)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  })

  useEffect(() => {
    if (!isLoaded) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
        setUserLocation(coords)
        fetchNearbyRestaurants(coords, minRating)
      },
      (err) => {
        console.error('Geolocation error:', err)
        setUserLocation(defaultCenter)
        fetchNearbyRestaurants(defaultCenter, minRating)
      }
    )
  }, [isLoaded])

  const fetchNearbyRestaurants = async (coords, ratingThreshold) => {
    const { lat, lng } = coords

    try {
      const response = await fetch(`/api/places-proxy?lat=${lat}&lng=${lng}`)
      const data = await response.json()

      if (data.status === 'OK') {
        const filtered = data.results.filter(place => {
          const name = place.name?.toLowerCase() || ""
          const types = place.types || []
          const rating = place.rating || 0

          const disallowedTypes = [
            "lodging", "store", "shopping_mall", "gym", "hair_care",
            "pharmacy", "supermarket", "clothing_store", "bakery"
          ]

          const blacklistedWords = ["hotel", "carrefour", "flunch", "boulangerie", "pharmacie"]

          const isNonRestaurant = types.some(t => disallowedTypes.includes(t))
          const isBlacklistedByName = blacklistedWords.some(w => name.includes(w))

          return !isNonRestaurant && !isBlacklistedByName && rating >= ratingThreshold
        })

        setRestaurants(filtered)
        setRatingChanged(false)
      } else {
        console.error('Places API error:', data.status, data.error_message)
      }
    } catch (error) {
      console.error('Failed to fetch restaurants:', error)
    }
  }

  if (!isLoaded) return <p className="text-white p-6">Loading map...</p>

  return (
    <main className="py-12 px-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-6">🍜 Restaurant Radar</h1>

      {/* Slider Filter */}
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
            onClick={() => fetchNearbyRestaurants(userLocation || defaultCenter, minRating)}
            className="mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded"
          >
            Apply Filter
          </button>
        )}
      </div>

      {/* Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={13}
      >
        {restaurants.map((place) => (
          <Marker
            key={place.place_id}
            position={{
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng
            }}
            title={place.name}
            onClick={() => setSelectedPlaceId(place.place_id)}
          />
        ))}

        {restaurants.map((place) =>
          selectedPlaceId === place.place_id ? (
            <InfoWindow
              key={`info-${place.place_id}`}
              position={{
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng
              }}
              onCloseClick={() => setSelectedPlaceId(null)}
            >
              <div className="text-black max-w-xs">
                <p className="font-bold">{place.name}</p>
                <p className="text-sm">{place.vicinity}</p>
                {place.rating && (
                  <p className="text-yellow-500 text-sm">
                    {'⭐'.repeat(Math.floor(place.rating))} ({place.rating})
                  </p>
                )}
              </div>
            </InfoWindow>
          ) : null
        )}
      </GoogleMap>

      {/* Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((place) => {
          const cuisineTags = place.types?.filter(
            t =>
              ![
                "restaurant", "food", "establishment",
                "point_of_interest", "store"
              ].includes(t)
          )

          const mainTag = cuisineTags?.[0] || "restaurant"
          const emoji = emojiByCuisine[mainTag] || "🍽️"

          return (
            <div
              key={place.place_id}
              className="bg-gray-900 border border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition"
              onClick={() => setSelectedPlaceId(place.place_id)}
            >
              <p className="text-lg font-bold mb-1">{place.name}</p>
              <p className="text-gray-400 text-sm mb-1">{place.vicinity}</p>

              {place.rating && (
                <p className="text-yellow-400 text-sm mb-1">
                  {'⭐'.repeat(Math.floor(place.rating))} ({place.rating})
                </p>
              )}

              {mainTag && (
                <p className="text-gray-400 text-xs italic mb-1">
                  {emoji} {mainTag.replaceAll('_', ' ')}
                </p>
              )}

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-sm mt-2 inline-block hover:underline"
              >
                📍 Open in Google Maps
              </a>
            </div>
          )
        })}
      </div>
    </main>
  )
}
