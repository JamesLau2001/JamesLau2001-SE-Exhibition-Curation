export const handlePageChange = (page, router, searchParams, setCurrentPage) => {
  if (page < 1) return;

  searchParams.set("page", page);
  router.push(
    {
      pathname: router.pathname,
      query: Object.fromEntries(searchParams),
    },
    undefined,
    { shallow: true }
  );

  setCurrentPage(page);
};
