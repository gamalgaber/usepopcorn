import { useEffect, useState } from "react";

const KEY = "571c2396";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("something went wrong!");

          const data = await res.json();
          if (data.response === "False") throw new Error("movie not found");

          setMovies(data.Search);
          // console.log(data.Search);
        } catch (error) {
          if (error.name !== "AbortError") setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);

        setError("");
        return;
      }
      fetchMovies();

      // between rerender component the clean up execute
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return {movies, isLoading, error};
}
