window.asciiTypewriter = async (elementId, text, dotnetHelper) => {
  // 1. Get the container element and clear existing content
  const el = document.getElementById(elementId);
  el.innerHTML = '';

  // 2. Normalize text to remove carriage returns and BOM characters
  text = text
    .replace(/\r/g, '')
    .replace(/^\uFEFF/, '')
    .trimEnd(); // Remove trailing whitespace/newlines

  // 3. Split the text into lines and find overall dimensions
  const lines = text.split('\n');
  const numRows = lines.length;
  const numCols = Math.max(...lines.map((line) => line.length));

  // 4. Define your column boundary (first name vs. last name)
  const columnBoundary = 42;

  // 5. Tailwind color classes
  const colorFirstName = 'text-terminal-red'; // for columns <= boundary
  const colorLastName = 'text-terminal-cyan'; // for columns > boundary

  // 6. Pad all lines to ensure equal length
  const paddedLines = lines.map((line) => line.padEnd(numCols, ' '));

  // 7. Lock the container height to avoid layout shifting
  const lineHeight = 1.2;
  el.style.height = `${(numRows * lineHeight).toFixed(2)}rem`;
  el.style.overflow = 'hidden';

  // 8. Build a grid of rows and spans
  const grid = [];
  for (let r = 0; r < numRows; r++) {
    const rowEl = document.createElement('div');
    rowEl.style.lineHeight = `${lineHeight}rem`;
    rowEl.style.height = `${lineHeight}rem`;

    const rowSpans = [];
    for (let c = 0; c < numCols; c++) {
      const span = document.createElement('span');
      span.textContent = ' '; // placeholder
      span.style.whiteSpace = 'pre';
      rowEl.appendChild(span);
      rowSpans.push(span);
    }
    grid.push(rowSpans);
    el.appendChild(rowEl);
  }

  // 9. Typewriter effect, column by column
  let col = 0;
  const delay = 25; // ms per column

  function typeNextColumn() {
    if (col >= numCols) {
      // Finished typing; notify .NET if applicable
      if (dotnetHelper) {
        dotnetHelper.invokeMethodAsync('OnBannerTyped');
      }
      return;
    }

    // Assign characters and colors in this column for each row
    for (let r = 0; r < numRows; r++) {
      const char = paddedLines[r][col];
      const span = grid[r][col];
      span.textContent = char;

      // Split by column boundary
      if (col <= columnBoundary) {
        span.classList.add(colorFirstName);
      } else {
        span.classList.add(colorLastName);
      }
    }

    col++;
    setTimeout(typeNextColumn, delay);
  }

  // 10. Start the animation
  typeNextColumn();
};
