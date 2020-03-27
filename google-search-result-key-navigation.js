addEventListener("keydown", event => {
  computeKeyDownAction(event);
});

const updatePointerPosition = event => {
  switch (event.key) {
    case "ArrowDown":
      selectNextLink();
      event.preventDefault();
      break;
    case "ArrowUp":
      selectPreviousLink();
      event.preventDefault();
      break;
    case "Escape":
      selectSearchBox();
      event.preventDefault();
      break;
    default:
      break;
  }
};

const computeKeyDownAction = event => {
  if (event.key === "Tab") {
    movePointerAtInitialPosition();
    event.preventDefault();
  }

  if (doesActiveLinkExists()) {
    updatePointerPosition(event);
  }
};
