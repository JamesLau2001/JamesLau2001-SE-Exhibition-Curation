export const handleSearchChange = (e, router, searchParams) => {
    const artist = e.target.value;
    searchParams.set("artist", artist.trim());

    router.push(
      {
        pathname: router.pathname,
        query: Object.fromEntries(searchParams),
      },
      undefined,
      { shallow: true }
    );
  };