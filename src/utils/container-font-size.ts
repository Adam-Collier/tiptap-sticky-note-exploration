type AdjustFontSizeType = {
  containerEl: HTMLElement
  innerEl: HTMLElement
}

let editorFontSize = 60

export const containerFontSize = ({
  containerEl,
  innerEl,
}: AdjustFontSizeType) => {
  const containerHeight = containerEl.clientHeight
  let innerElHeight = innerEl.clientHeight

  const padding = 16
  const desiredHeight = containerHeight - 2 * padding
  const deltaFontValue = 0.1
  const maxFontSize = CSS.supports('font-size', 'cqw') ? 16 : 64
  const minFontSize = CSS.supports('font-size', 'cqw') ? 0.1 : 4
  const fontSizeUnit = CSS.supports('font-size', 'cqw') ? 'cqw' : 'px'

  const applyFontSizeAndLineHeight = () => {
    innerEl.style.fontSize = `${editorFontSize}${fontSizeUnit}`
    innerEl.style.lineHeight = `${editorFontSize * 1.4}${fontSizeUnit}`
  }

  const binarySearchFontSize = (low: number, high: number) => {
    if (low > high) {
      // Font size not found within the given range
      return
    }

    // console.log("the binary font size function has been called");

    const mid = (low + high) / 2
    editorFontSize = mid
    applyFontSizeAndLineHeight()
    innerElHeight = innerEl.clientHeight

    if (Math.abs(innerElHeight - desiredHeight) < deltaFontValue) {
      // Font size found within the acceptable range
      return
    } else if (innerElHeight > desiredHeight) {
      // Font size too large, search in the lower half
      binarySearchFontSize(low, mid - deltaFontValue)
    } else {
      // Font size too small, search in the upper half
      binarySearchFontSize(mid + deltaFontValue, high)
    }
  }

  binarySearchFontSize(minFontSize, maxFontSize)
}
