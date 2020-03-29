let links = [];
let focusedLinkId = 0;

const initializePageData = () => {
  const rawLinks = document
      .getElementById("rso")
      .querySelectorAll("div.g")
      .forEach(element => {
        console.log('element : ', element);
        console.log('element : ', element);
        console.log('element2 : ', element.attributes.class);
        console.log('element3 : ', element.attributes.length);
        const elementClasses = element.class;

        if (elementClasses.indexOf("g") !== -1) {
          links = links.push(element);
        }
      })
  console.log('links : ', links);
};


addEventListener("keydown", event => {
  initializePageData();
  computeKeyDownAction(event);
});

const updatePointerPosition = event => {
  switch (event.key) {
    case "ArrowDown":
      focusedLinkId++;
      // selectNextLink();
      // event.preventDefault();
      break;
    case "ArrowUp":
      focusedLinkId--;
      // selectPreviousLink();
      // event.preventDefault();
      break;
    case "Escape":
      selectSearchBox();
      event.preventDefault();
      break;
    default:
      break;
  }
  console.log('focusedLinkId : ', focusedLinkId);
  console.log('links[focusedLinkId] : ', links[focusedLinkId]);
  links[focusedLinkId].querySelector('a').focus();
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
