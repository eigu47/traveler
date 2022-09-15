import ResultsText from "@/components/map/ResultsText";
import { render } from "@testing-library/react";

const mockRouter = jest.spyOn(require("next/router"), "useRouter");

const mockInfiniteQuery = jest.spyOn(
  require("@tanstack/react-query"),
  "useInfiniteQuery"
);

describe("ResultsText", () => {
  beforeEach(() => {
    // Initial state (no queryLatLng and no fetching)
    mockRouter.mockImplementation(() => ({
      query: "",
    }));
    mockInfiniteQuery.mockImplementation(() => ({
      isFetching: false,
      isFetchingNextPage: false,
      isError: false,
    }));
  });

  it("initial state renders idle text", () => {
    const { getByText } = render(<ResultsText />);

    const idleText = getByText(/in the map to start searching/i);

    expect(idleText).toBeInTheDocument();
  });

  it("fetching renders loading img", () => {
    mockInfiniteQuery.mockImplementation(() => ({
      isFetching: true,
    }));

    const { getByRole } = render(<ResultsText />);

    const loadingState = getByRole("img", { name: /loading\.\.\./i });

    expect(loadingState).toBeInTheDocument();
  });

  it("no results and valid latlng query renders no results text", () => {
    mockRouter.mockImplementation(() => ({
      query: {
        lat: 1,
        lng: 1,
      },
    }));

    const { getByText } = render(<ResultsText />);

    const noResultsText = getByText(/no results found/i);

    expect(noResultsText).toBeInTheDocument();
  });

  it("no favorites in query favs renders no favorites text", () => {
    mockRouter.mockImplementation(() => ({
      query: { favs: true },
    }));

    const { getByText } = render(<ResultsText />);

    const noFavoritesText = getByText(/no favorites yet/i);

    expect(noFavoritesText).toBeInTheDocument();
  });

  it("error renders error text", () => {
    mockInfiniteQuery.mockImplementation(() => ({
      isError: true,
    }));

    const { getByText } = render(<ResultsText />);

    const errorText = getByText(/something went wrong\.\.\./i);

    expect(errorText).toBeInTheDocument();
  });
});
