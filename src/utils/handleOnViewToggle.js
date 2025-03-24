export const handleOnViewToggleUtil = ({
  currentlyOnView,
  setCurrentlyOnView,
  router,
  searchParams,
}) => {
  const newOnViewValue = currentlyOnView === "true" ? "false" : "true";
  setCurrentlyOnView(newOnViewValue);

  searchParams.set("currently_on_view", newOnViewValue);

  router.push(
    {
      pathname: router.pathname,
      query: Object.fromEntries(searchParams),
    },
    undefined,
    { shallow: true }
  );
};
