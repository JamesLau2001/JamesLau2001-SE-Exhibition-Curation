export const handleSearchInputChange = ({
  e,
  router,
  searchParams,
  artistSearch,
  setArtistSearch,
  setLastPageBeforeSearch,
  lastPageBeforeSearch,
  currentPage,
}) => {
  const newSearch = e.target.value.trim();
  setArtistSearch(newSearch);

  if (newSearch.length > 0) {
    if (!artistSearch) {
      setLastPageBeforeSearch(currentPage);
    }
    searchParams.set("artist", newSearch);
    searchParams.set("page", "1");
  } else {
    searchParams.delete("artist");
    searchParams.set("page", lastPageBeforeSearch.toString());
  }

  router.push(
    {
      pathname: router.pathname,
      query: Object.fromEntries(searchParams),
    },
    undefined,
    { shallow: true }
  );
};
