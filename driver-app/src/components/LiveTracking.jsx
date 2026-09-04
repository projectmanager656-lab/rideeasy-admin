import React, { useEffect, useMemo, useState, useCallback } from 'react'
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  useMap,
} from 'react-leaflet'
import { getMapTileUrlTemplate } from '../config/externalEndpoints'

const containerStyle = {
  width: '100%',
  height: '100%',
}

const defaultCenter = {
  lat: 18.5204,
  lng: 73.8567,
}

const MapUpdater = ({ position }) => {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.setView(
        [position.lat, position.lng],
        16,
        { animate: true }
      )
    }
  }, [position, map])

  return null
}

const LiveTracking = ({
  onPositionChange,
  onGeolocationError,
}) => {
  const [currentPosition, setCurrentPosition] = useState(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [geoUnavailable, setGeoUnavailable] = useState(false)
  const [requesting, setRequesting] = useState(true)

  const center = useMemo(() => {
    if (!currentPosition) {
      return [
        defaultCenter.lat,
        defaultCenter.lng,
      ]
    }

    return [
      currentPosition.lat,
      currentPosition.lng,
    ]
  }, [currentPosition])

  /*
   * SUCCESS
   */
  const handleSuccess = useCallback(
    (position) => {
      const { latitude, longitude } =
        position.coords

      const nextPosition = {
        lat: latitude,
        lng: longitude,
      }

      console.log('GPS LOCATION:', nextPosition)

      setCurrentPosition(nextPosition)
      setPermissionDenied(false)
      setGeoUnavailable(false)
      setRequesting(false)

      onPositionChange?.(nextPosition)
    },
    [onPositionChange]
  )

  /*
   * ERROR
   */
  const handleError = useCallback(
    (error) => {
      console.log(
        'GPS ERROR:',
        error.code,
        error.message
      )

      setRequesting(false)

      if (error.code === 1) {
        // Permission denied
        setPermissionDenied(true)
        setGeoUnavailable(false)
      } else {
        // GPS OFF / unavailable / timeout
        setGeoUnavailable(true)
      }

      onGeolocationError?.(error)
    },
    [onGeolocationError]
  )

  /*
   * REQUEST LOCATION
   */
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setRequesting(false)
      setGeoUnavailable(true)
      return
    }

    console.log('REQUESTING GPS...')

    setRequesting(true)

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    )
  }, [handleSuccess, handleError])

  /*
   * INITIAL LOCATION REQUEST
   */
  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  /*
   * WATCH GPS
   */
  useEffect(() => {
    if (!navigator.geolocation) {
      return
    }

    const watchId =
      navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 15000,
        }
      )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [handleSuccess, handleError])

  /*
   * IMPORTANT:
   *
   * When user comes back from Android Settings,
   * check GPS again automatically.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible'
      ) {
        console.log(
          'App became active - checking GPS again'
        )

        setTimeout(() => {
          requestLocation()
        }, 500)
      }
    }

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    )

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      )
    }
  }, [requestLocation])

  /*
   * ALSO CHECK WHEN WINDOW GETS FOCUS
   */
  useEffect(() => {
    const handleFocus = () => {
      console.log(
        'App focused - checking GPS again'
      )

      setTimeout(() => {
        requestLocation()
      }, 500)
    }

    window.addEventListener(
      'focus',
      handleFocus
    )

    return () => {
      window.removeEventListener(
        'focus',
        handleFocus
      )
    }
  }, [requestLocation])

  return (
    <div className="relative h-full w-full">

      {/* REQUESTING */}
      {requesting && (
        <div className="absolute left-3 right-3 top-3 z-[500] rounded-xl bg-black/90 px-4 py-3 text-center text-sm text-white shadow-lg">
          📍 Checking location...
        </div>
      )}

      {/* PERMISSION DENIED */}
      {permissionDenied && (
        <div className="absolute left-3 right-3 top-3 z-[500] rounded-xl bg-red-600 px-4 py-3 text-center text-sm font-medium text-white shadow-lg">
          Location permission required.
          <br />
          Allow location permission in
          Android settings.
        </div>
      )}

      {/* GPS OFF */}
      {geoUnavailable &&
        !permissionDenied && (
          <div className="absolute left-3 right-3 top-3 z-[500] rounded-xl bg-orange-600 px-4 py-3 text-center text-sm font-medium text-white shadow-lg">
            GPS is unavailable.
            <br />
            Please turn on Location/GPS.
            <br />

            <button
              type="button"
              onClick={requestLocation}
              className="mt-2 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black"
            >
              Check Again
            </button>
          </div>
        )}

      <MapContainer
        center={center}
        zoom={15}
        style={containerStyle}
        zoomControl
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url={getMapTileUrlTemplate()}
        />

        <MapUpdater
          position={currentPosition}
        />

        {currentPosition && (
          <>
            {/* Accuracy circle */}
            <CircleMarker
              center={[
                currentPosition.lat,
                currentPosition.lng,
              ]}
              radius={25}
              pathOptions={{
                color: '#2563eb',
                weight: 1,
                fillColor: '#2563eb',
                fillOpacity: 0.15,
              }}
            />

            {/* Current location */}
            <CircleMarker
              center={[
                currentPosition.lat,
                currentPosition.lng,
              ]}
              radius={9}
              pathOptions={{
                color: '#ffffff',
                weight: 3,
                fillColor: '#2563eb',
                fillOpacity: 1,
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  )
}

export default LiveTracking