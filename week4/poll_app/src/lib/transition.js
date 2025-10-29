export function positionAwareScale(node, params) {
  const { duration = 400, startScale = 0.5, clickPosition } = params;

  const rect = node.getBoundingClientRect();
  const originX = ((clickPosition.x - rect.left) / rect.width) * 100;
  const originY = ((clickPosition.y - rect.top) / rect.height) * 100;

  node.style.transformOrigin = `${originX}% ${originY}%`;
  console.log('clickPosition:', clickPosition.x, clickPosition.y);

  return {
    duration,
    css: (t) => {
      const scale = startScale + (1 - startScale) * t;
      return `
          transform: scale(${scale});
          opacity: ${t};
        `;
    }
  };
}
