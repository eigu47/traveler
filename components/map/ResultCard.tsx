import Image from "next/image";
import { Result } from "../../types/nearbySearchResult";
import getDistance from "../../utils/getDistance";
import Rating from "./Rating";

interface Props {
  place: Result;
  queryLatLng: { lat: number; lng: number } | undefined;
}

export default function ResultCard({ place, queryLatLng }: Props) {
  return (
    <article className="min-h-56 m-2 my-5 flex flex-col rounded-xl bg-slate-100 text-center text-sm shadow">
      <div className="flex h-40 rounded-xl bg-slate-200">
        <div className="w-40 flex-none p-2">
          <Image
            className="rounded-md bg-slate-300"
            src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${place.photos[0].photo_reference}&maxheight=200&maxwidth=200&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
            alt={place.name}
            width={200}
            height={200}
          />
        </div>
        <div className="h-full w-full">
          <div className="my-4 flex flex-col items-center space-y-1">
            <Rating rating={place.rating} className={"text-lg"} />
            <p className="">{`${place.rating} out of ${place.user_ratings_total} rewiews.`}</p>
          </div>
          {queryLatLng && (
            <p className="">{`${getDistance(
              place.geometry.location,
              queryLatLng
            )} km from the center`}</p>
          )}
        </div>
      </div>
      <div className="w-full p-1 pb-2">
        <h4 className="text-lg">{place.name}</h4>
        <p className="">{place.vicinity}</p>
      </div>
    </article>
  );
}
