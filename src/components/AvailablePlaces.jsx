import { useEffect, useState } from "react";
import { sortPlacesByDistance } from "../loc.js";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [error, setError] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPlace() {
      setIsLoading(true);

      try {
        console.log("TEST");
        const resData = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((location) => {
          const sortedLocation = sortPlacesByDistance(
            resData.places,
            location.coords.latitude,
            location.coords.longitude
          );
          console.log(sortedLocation);
          setAvailablePlaces(sortedLocation);
          setIsLoading(false);
        });
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch places, please try again later.",
        });
        setIsLoading(false);
      }
    }

    fetchPlace();
    // fetch("http://localhost:3000/places")
    //   .then((response) => {
    //     console.log(response);
    //     return response.json();
    //   })
    //   .then((resData) => {
    //     console.log(resData);
    //     setAvailablePlaces(resData.places);
    //   });
  }, []);

  if (error) {
    return <Error title="An error occured!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isLoading}
      loadingText="Data is Fetching..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
