export const handleSortChange = (event, router, searchParams) => {
    const titleSort = event.target.value;
    searchParams.set("title", titleSort);
    
    router.push(
      {
        pathname: router.pathname,
        query: Object.fromEntries(searchParams),
      },
      undefined,
      { shallow: true }
    );
  };
  