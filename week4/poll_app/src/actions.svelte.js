export function handleClickOutside(element, closePoll) {
  function handleClick(event) {
    const targetEl = event.target;
    if (element && !element.contains(targetEl)) {
      closePoll();
    }
  }
  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  };
}
