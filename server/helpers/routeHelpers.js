function isActiveRoute(route, currentRoute) {
  return route === currentRoute ? "active" : ""; // "currentRoute" is either going to be "active" or empty/inactive.
}

module.exports = { isActiveRoute };