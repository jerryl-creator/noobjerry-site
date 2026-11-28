// Runs before the page draws (loaded in <head>), so there's no flash of the wrong theme.
(function () {
  var root = document.documentElement;
  try {
    // A theme the visitor picked with the button wins; otherwise follow their device setting.
    var saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") root.dataset.theme = saved;
    else if (matchMedia("(prefers-color-scheme: light)").matches) root.dataset.theme = "light";
  } catch (e) {}
  // Play the pop-in intro (skipped for people who turned off animations).
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) root.classList.add("intro");
})();
