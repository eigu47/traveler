import {
  CircleF,
  GoogleMap,
  MarkerF,
  OverlayView,
  useLoadScript,
} from "@react-google-maps/api/";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { MdGpsFixed, MdLocationPin } from "react-icons/md";
import SearchBar from "./SearchBar";
import { useRouter } from "next/router";
import { NearbySearchResult } from "../../types/NearbySearchResult";
import { useState } from "react";
import Image from "next/image";

interface Props {
  radius: number;
  isLoaded: boolean;
}

export default function MapCanvas({ radius, isLoaded }: Props) {
  const router = useRouter();
  const mapRef = useRef<google.maps.Map>();
  const [showMenu, setShowMenu] = useState<google.maps.LatLngLiteral>();
  const [loadFinish, setLoadFinish] = useState(false);

  const { data, isSuccess } = useQuery<NearbySearchResult>(["nearby"], {
    enabled: false,
  });

  // const isLoaded = false;

  function getCurrentPosition() {
    navigator?.geolocation?.getCurrentPosition((pos) => {
      router.replace({
        pathname: "/map",
        query: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      });
    });
  }

  const queryLatLng = useMemo(() => {
    if (
      router.query.lat &&
      router.query.lng &&
      !isNaN(+router.query.lat) &&
      !isNaN(+router.query.lng)
    )
      return { lat: +router.query.lat, lng: +router.query.lng };
  }, [router.query]);

  useEffect(() => {
    if (queryLatLng) {
      mapRef.current?.panTo(queryLatLng);

      if (mapRef.current?.getZoom() ?? 12 < 12) mapRef.current?.setZoom(13);
    }
  }, [queryLatLng]);

  function handleRightClick(e: google.maps.MapMouseEvent) {
    setShowMenu({
      lat: e.latLng?.lat() ?? 0,
      lng: e.latLng?.lng() ?? 0,
    });
  }

  function handleClickBtn() {
    if (showMenu) {
      router.replace({
        pathname: "map",
        query: {
          lat: showMenu?.lat,
          lng: showMenu?.lng,
        },
      });
    }
    setShowMenu(undefined);
  }

  useEffect(() => {
    function handleClick() {
      setShowMenu(undefined);
    }
    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <section className="h-full w-full bg-[#e5e3df]">
      {!loadFinish && (
        <div className="flex h-full w-full items-center justify-center">
          <Image src="/loading.svg" alt="Loading..." height={200} width={200} />
        </div>
      )}
      {isLoaded && (
        <>
          <GoogleMap
            zoom={queryLatLng ? 13 : 10}
            center={queryLatLng ?? defaultCenter}
            mapContainerClassName="h-full w-full"
            onLoad={(map) => {
              mapRef.current = map;
              setLoadFinish(true);
            }}
            onRightClick={handleRightClick}
            options={{
              mapId: "a73e177530bb64aa",
              disableDefaultUI: true,
              clickableIcons: false,
            }}
          >
            {queryLatLng && (
              <CircleF
                options={{
                  center: queryLatLng,
                  radius: radius,
                  clickable: false,
                  strokeWeight: 0.1,
                  fillColor: "DodgerBlue",
                  fillOpacity: 0.1,
                }}
              />
            )}
            {isSuccess &&
              data.results.map((places) => (
                <MarkerF
                  key={places.place_id}
                  position={{
                    lat: places.geometry.location.lat,
                    lng: places.geometry.location.lng,
                  }}
                />
              ))}
            {showMenu && (
              <OverlayView position={showMenu} mapPaneName="overlayMouseTarget">
                <button
                  onClick={handleClickBtn}
                  className="m-1 flex items-center space-x-2 rounded-md bg-slate-50 px-3 py-2 text-sm shadow ring-1 ring-black/20 hover:bg-blue-200"
                >
                  <MdLocationPin className="-mx-1 text-xl" />
                  <span>Set center here</span>
                </button>
              </OverlayView>
            )}
          </GoogleMap>
          <SearchBar />
        </>
      )}
      <button
        onClick={getCurrentPosition}
        className="absolute bottom-6 right-4 rounded-lg bg-white p-1 text-2xl text-gray-600 shadow-md ring-1 ring-black/20 duration-75 ease-in-out hover:text-black"
      >
        <MdGpsFixed />
      </button>
    </section>
  );
}

const defaultCenter = {
  lat: 35.6762,
  lng: 139.6503,
};