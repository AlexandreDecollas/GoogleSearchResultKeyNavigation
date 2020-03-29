const lang = {
  arrow_instructions:
    "Use the up and down arrow keys to select each result. Press Enter to go to the selection."
};
const POINTER_CLASS = "keybord-pointer";
const LINK_CLASS = "keyboard-link";
const DIRECTION_UP = -1;
const DIRECTION_DOWN = 1;


const getStyle = function(element, properties) {
  return getComputedStyle(element, null)[properties];
};
const isTextRTL = () =>
  getStyle(document.body || document.documentElement, "direction") === "rtl";

// var addClass = (el, cls) => el.classList && el.classList.add(cls);

const doesActiveLinkExists = () => {
  return findElementByClass(document.activeElement, LINK_CLASS) !== null ||
    document.activeElement === document.body;
};

const getLinkElement = function(element) {
  var retEl = element;
  if (retEl.nodeName !== "A") {
    var ls = element.querySelectorAll("a.l");

    if (ls.length === 1) retEl = ls[0];
    else retEl = element.querySelector("a:not(:empty)");
  }
  return retEl || element.querySelector("a");
};

const findElementByClass = function(element, className) {
  if (!element) return null;
  do {
    if (element.classList && element.classList.contains(className))
      return element;
  } while ((element = element.parentNode));
  return null;
};

const getElementFromId = id => document.getElementById(id);

const createPointer = function() {
  const pointer = document.createElement("span");
  pointer.innerHTML = isTextRTL() ? "&#9668;" : "&#9658;";
  pointer.id = POINTER_CLASS;
  pointer.title = lang.arrow_instructions;
  return pointer;
};

const turnIdsIntoElements = ([_, id]) => [_, getElementFromId(id)];
const removeAllNotFound = ([_, el]) => el;
const detectLinksAndSubLinks = links => {
  const linksAndSubLinks = [];
  links.map(([selector, el]) => {
    Array.from(el.querySelectorAll(selector)).map(link => {
      [link]
        .concat(
          Array.from(
            link.querySelectorAll(
              "div." + ("lclbox" === link.id ? "intrlu" : "sld")
            )
          )
        )
        // remove All non links
        .filter(_lnk => el.nodeName === "A" || el.querySelector("a"))
        // Append and add class
        .map(
          lnk => linksAndSubLinks.push(lnk) && lnk.classList.add(LINK_CLASS)
        );
    });
  });
  return linksAndSubLinks;
};

const findLinks = () => {
  let cleanedLinkList = [
    [".ads-ad", "taw"],
    ["div.e", "topstuff"],
    [".g", "res"],
    [".ads-ad", "bottomads"],
    ["a.pn", "nav"],
    [".ads-ad", "rhs_block"],
    ["a", "rhs_block"]
  ]
    .map(turnIdsIntoElements)
    .filter(removeAllNotFound);

  return detectLinksAndSubLinks(cleanedLinkList);
};
const getLastActiveLink = () => {
  return (
    findElementByClass(document.activeElement, LINK_CLASS) ||
    findElementByClass(getElementFromId(POINTER_CLASS), LINK_CLASS)
  );
};
const movePointer = (linksList, index) => {
  let pointer = getElementFromId(POINTER_CLASS) || createPointer();
  pointer.style.paddingTop = getStyle(linksList[index], "padding-top");
  linksList[index].appendChild(pointer);

  var lnkEL = getLinkElement(linksList[index]);
  lnkEL.style.outline = "none";
  lnkEL.focus();
};
const isValidLink = (linkElement, linksList, index) => {
  return (
    linksList[index].offsetHeight > 0 &&
    getStyle(linkElement, "visibility") !== "hidden" &&
    findElementByClass(linkElement, LINK_CLASS) === linksList[index]
  );
};

const linkListNotBrowsed = (listLength, index) => {
  return index >= 0 && index < listLength;
};

const movePointerOnNextValidLink = (
  linksList,
  lastActiveLinkIndex,
  direction
) => {
  let nextValidLinkIndex = lastActiveLinkIndex;

  while (linkListNotBrowsed(linksList.length, nextValidLinkIndex)) {
    let lnkEl = getLinkElement(linksList[nextValidLinkIndex]);
    if (isValidLink(lnkEl, linksList, nextValidLinkIndex)) break;
    nextValidLinkIndex += direction || 1;
  }

  if (linksList[nextValidLinkIndex]) {
    movePointer(linksList, nextValidLinkIndex);
  }
};
const selectLink = function(direction, base) {
  direction = +direction || 0;

  if (
    document.getElementById("center_col").parentNode.classList.contains("fade")
  )
    return;

  var links = findLinks();
  var lastActive = getLastActiveLink();

  var actualActiveLinkPosition = +base || 0;
  if (typeof base == "undefined" && lastActive) {
    actualActiveLinkPosition = links.indexOf(lastActive) + direction;
  }

  movePointerOnNextValidLink(links, actualActiveLinkPosition, direction);
};
const unselect = () => {
  var ptr = getElementFromId(POINTER_CLASS);
  ptr && ptr.parentElement && ptr.parentElement.removeChild(ptr);
};

const getSearchBox = () => {
  return Array.from(document.getElementsByName("q")).filter(
    element => element.type === "text"
  )[0];
};

const movePointerAtInitialPosition = () => {
  if ([document.body, getSearchBox()].indexOf(document.activeElement) !== -1) {
    selectLink(0, 0);
    return;
  }
  unselect();
};
const selectNextLink = () => {
  selectLink(DIRECTION_DOWN);
};
const selectPreviousLink = () => {
  selectLink(DIRECTION_UP);
};
const selectSearchBox = () => {
  getSearchBox().select();
  document.body.scrollTop = 0;
  unselect();
};
