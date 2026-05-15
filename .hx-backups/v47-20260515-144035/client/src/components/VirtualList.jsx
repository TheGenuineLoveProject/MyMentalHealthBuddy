import { useState, useRef, useEffect, useCallback } from "react";

export default function VirtualList({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className = "",
  onEndReached,
  endReachedThreshold = 100
}) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e) => {
    const { scrollTop: newScrollTop, scrollHeight, clientHeight } = e.target;
    setScrollTop(newScrollTop);

    if (onEndReached && scrollHeight - (newScrollTop + clientHeight) < endReachedThreshold) {
      onEndReached();
    }
  }, [onEndReached, endReachedThreshold]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={item.id || startIndex + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function VirtualGrid({
  items,
  itemWidth,
  itemHeight,
  containerHeight,
  gap = 0,
  renderItem,
  overscan = 2,
  className = ""
}) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width);
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const columns = Math.floor((containerWidth + gap) / (itemWidth + gap)) || 1;
  const rows = Math.ceil(items.length / columns);
  const rowHeight = itemHeight + gap;
  const totalHeight = rows * rowHeight;

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRow = Math.min(rows, Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan);

  const startIndex = startRow * columns;
  const endIndex = Math.min(items.length, endRow * columns);
  const visibleItems = items.slice(startIndex, endIndex);

  const offsetY = startRow * rowHeight;

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, ${itemWidth}px)`,
            gap: `${gap}px`
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={item.id || startIndex + index}
              style={{ width: itemWidth, height: itemHeight }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
