import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const BASE_URL = "http://localhost:8000";
const CityContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  curCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: action.payload };
    case "cities/loaded":
      return { ...state, cities: action.payload };
    case "city/loaded":
      return { ...state, curCity: action.payload };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        curCity: action.payload,
      };
    case "city/removed":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        curCity: {},
      };
    case "rejected":
      return { ...state, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { cities, isLoading, curCity, error } = state;

  // console.log(cities);
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [curCity, setCurCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        // setIsLoading(true);
        dispatch({ type: "loading", payload: true });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an arror loading the cities",
        });
      } finally {
        dispatch({ type: "loading", payload: false });
      }
    }

    fetchCities();
  }, []);

  const fetchCityData = useCallback(
    async function fetchCityData(id) {
      if (curCity.id === Number(id)) return;
      dispatch({ type: "loading", payload: true });

      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();

        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an arror loading the city",
        });
      } finally {
        dispatch({ type: "loading", payload: false });
      }
    },
    [curCity.id]
  );

  async function addNewCity(newCity) {
    try {
      dispatch({ type: "loading", payload: true });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // setCities((cities) => [...cities, data]);

      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an arror creating the city",
      });
    } finally {
      dispatch({ type: "loading", payload: false });
    }
  }

  async function removeCity(id) {
    try {
      dispatch({ type: "loading", payload: true });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      // setCities((cities) => cities.filter((city) => city.id !== id));

      dispatch({ type: "city/removed", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an arror removing the city",
      });
    } finally {
      dispatch({ type: "loading", payload: false });
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        curCity,
        fetchCityData,
        addNewCity,
        removeCity,
        error,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCities() {
  const context = useContext(CityContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside of the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
