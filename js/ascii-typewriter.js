window.asciiTypewriter = async (elementId, text, dotnetHelper) => {
  // 1. Get the container element and clear existing content
  const el = document.getElementById(elementId);
  el.innerHTML = '';

  // 2. Normalize text (remove carriage returns, BOM, trailing spaces)
  text = text
    .replace(/\r/g, '')
    .replace(/^\uFEFF/, '')
    .trimEnd();

  // 3. Split into lines, measure rows & columns
  const lines = text.split('\n');
  const numRows = lines.length;
  const numCols = Math.max(...lines.map((line) => line.length));

  // 4. Define a column boundary for coloring
  const columnBoundary = 42; // columns <= 42 => red, > 42 => cyan

  // 5. Tailwind color classes
  const colorFirstName = 'text-terminal-red';
  const colorLastName = 'text-terminal-cyan';

  // 6. Pad all lines so each is exactly numCols wide
  const paddedLines = lines.map((line) => line.padEnd(numCols, ' '));

  // 7. Lock container height to avoid layout shifting
  const lineHeightRem = 1.2;
  el.style.height = `${(numRows * lineHeightRem).toFixed(2)}rem`;
  el.style.overflow = 'hidden';

  // 8. Build a grid of rows/spans
  const grid = [];
  for (let r = 0; r < numRows; r++) {
    const rowEl = document.createElement('div');
    rowEl.style.lineHeight = `${lineHeightRem}rem`;
    rowEl.style.height = `${lineHeightRem}rem`; // optional, but keeps each row spaced

    const rowSpans = [];
    for (let c = 0; c < numCols; c++) {
      const span = document.createElement('span');
      span.textContent = ' '; // placeholder
      span.style.whiteSpace = 'pre'; // preserve spacing
      rowEl.appendChild(span);
      rowSpans.push(span);
    }
    grid.push(rowSpans);
    el.appendChild(rowEl);
  }

  // 9. Collect all coordinates in a diagonal wave order
  //    "diagonal index" = r + c
  const coords = [];
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      coords.push({ r, c, diag: r + c });
    }
  }
  // Sort primarily by diagonal, secondarily by row
  // This ensures each diagonal is typed from top to bottom
  coords.sort((a, b) => {
    if (a.diag !== b.diag) return a.diag - b.diag;
    return a.r - b.r; // or b.r - a.r for a different wave direction
  });

  // 10. Type each cell in that wave order
  let index = 0;
  const totalCells = coords.length;
  const minDelay = 3;
  const maxDelay = 8;

  function typeNextCell() {
    if (index >= totalCells) {
      // Finished typing all cells; notify .NET if applicable
      if (dotnetHelper) {
        dotnetHelper.invokeMethodAsync('OnBannerTyped');
      }
      return;
    }

    const { r, c } = coords[index];
    // Insert the character from padded text
    const char = paddedLines[r][c];
    const span = grid[r][c];
    span.textContent = char;

    // Color by boundary
    if (c <= columnBoundary) {
      span.classList.add(colorFirstName);
    } else {
      span.classList.add(colorLastName);
    }

    index++;
    // Small random delay to give a "human" feeling
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    setTimeout(typeNextCell, randomDelay);
  }

  // 11. Kick off the wave typing
  typeNextCell();
};
