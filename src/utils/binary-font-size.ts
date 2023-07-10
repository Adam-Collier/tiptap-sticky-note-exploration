type AdjustFontSizeType = {
  containerEl: HTMLElement;
  innerEl: HTMLElement;
};

let editorFontSize = 60;

export const binaryFontSize = ({
  containerEl,
  innerEl,
}: AdjustFontSizeType) => {
  const containerHeight = containerEl.clientHeight;
  let innerElHeight = innerEl.clientHeight;

  const padding = 16;
  const desiredHeight = containerHeight - 2 * padding;
  const deltaFontValue = 0.5;
  const maxFontSize = 64;
  const minFontSize = 4;

  const applyFontSizeAndLineHeight = () => {
    innerEl.style.fontSize = `${editorFontSize}px`;
    innerEl.style.lineHeight = `${editorFontSize * 1.2}px`;
  };

  const binarySearchFontSize = (
    low: number,
    high: number,
    isResizing: boolean
  ) => {
    if (low > high && !isResizing) {
      // Font size not found within the given range
      return;
    }

    const mid = (low + high) / 2;
    editorFontSize = mid;
    applyFontSizeAndLineHeight();
    innerElHeight = innerEl.clientHeight;

    if (Math.abs(innerElHeight - desiredHeight) < deltaFontValue) {
      // Font size found within the acceptable range
      return;
    } else if (innerElHeight > desiredHeight) {
      // Font size too large, search in the lower half
      binarySearchFontSize(low, mid - deltaFontValue, isResizing);
    } else {
      // Font size too small, search in the upper half
      binarySearchFontSize(mid + deltaFontValue, high, isResizing);
    }
  };

  binarySearchFontSize(minFontSize, maxFontSize, false);
};
