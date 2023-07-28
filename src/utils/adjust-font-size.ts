type AdjustFontSizeType = {
  containerEl: HTMLElement
  innerEl: HTMLElement
}

let editorFontSize = 60

export const adjustFontSize = ({
  containerEl,
  innerEl,
}: AdjustFontSizeType) => {
  const containerHeight = containerEl.clientHeight
  let innerElHeight = innerEl.clientHeight

  const padding = 16
  const desiredHeight = containerHeight - 2 * padding
  const deltaFontValue = 0.1
  const maxFontSize = 64
  const minFontSize = 4

  const decreaseFontSize = () => {
    while (innerElHeight > desiredHeight && editorFontSize > minFontSize) {
      editorFontSize -= deltaFontValue
      applyFontSizeAndLineHeight()
      innerElHeight = innerEl.clientHeight
      requestAnimationFrame(decreaseFontSize)
    }
  }

  const increaseFontSize = () => {
    while (innerElHeight < desiredHeight && editorFontSize < maxFontSize) {
      editorFontSize += deltaFontValue
      applyFontSizeAndLineHeight()
      innerElHeight = innerEl.clientHeight
      requestAnimationFrame(increaseFontSize)
    }
  }

  const applyFontSizeAndLineHeight = () => {
    innerEl.style.fontSize = `${editorFontSize}px`
    innerEl.style.lineHeight = `${editorFontSize * 1.2}px`
  }

  if (innerElHeight > containerHeight) {
    decreaseFontSize()
  } else if (innerElHeight < containerHeight) {
    increaseFontSize()
  }
}
