const container = document.querySelector(".masonry");
const children = [...container.children];
const verticalGap = 15;

function shouldSkipMasonry() {
	return window.innerWidth <= 900 && !window.matchMedia("print").matches && !window._printing;
}

function clearMasonry() {
    // Remove masonry styling
    container.classList.remove("masonry");

    // Reset container max-height
    container.style.height = `unset`;

    // Reset children to default
    for (let i = 0; i < children.length; i++) children[i].style.transform = "none";
}

function calculateElementBounds(element) {
    const bounds = element.getBoundingClientRect();
    const height = Math.max(
        bounds.height,
        element.offsetHeight,
        element.clientHeight,
        element.scrollHeight
    );
    const width = Math.max(
        bounds.width,
        element.offsetWidth,
        element.clientWidth,
        element.scrollWidth
    );

    return { height, width };
}

function setChildrenMinimumWidth(value) {
    for (let i = 0; i < children.length; i++) children[i].style.minWidth = value;
}

function masonry() {
    const containerWidth = container.offsetWidth;
    let columns = 2;

    // If the screen size is too smals
    if (shouldSkipMasonry()) {
        // Make each item take up the full width of the container and be a full row
        columns = 1;
        setChildrenMinimumWidth("100%");
    } else {
        // Otherwise, spread the items out evenly
        setChildrenMinimumWidth("unset");
    }

    // Ensure masonry styling
    container.classList.add("masonry");

    // Define sizing
    const rowOffsets = new Array(columns).fill(verticalGap);
    let columnOffset = 0;

    // Iterates trough children and applies masonry
    for (let i = 0; i < children.length; i++) {
        const column = i % columns;
        const child = children[i];
        const bounds = calculateElementBounds(child);

        // Apply to the element
        child.style.transform = `translate(${Math.ceil(columnOffset)}px, ${Math.ceil(rowOffsets[column])}px)`;
		child.style.opacity = 1;

        // Append the offsets for the next child
		rowOffsets[column] += bounds.height + verticalGap;
		columnOffset += containerWidth - bounds.width;

        // Last column, reset column offset and start new row
		if (column >= columns - 1) columnOffset = 0;
    }

    // Set the container height
    let containerHeight = Math.max(...rowOffsets) ;
    container.style.height = `${containerHeight}px`;
}

window.addEventListener("load", function () {
	setTimeout(() => {
		masonry();
	}, 0);
});

window.addEventListener("resize", function () {
	setTimeout(() => {
		masonry();
	}, 10);
});
