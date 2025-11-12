"use client"

import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

interface VirtualizedListProps<T> {
  items: T[]
  height: number
  itemHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  estimateSize?: (index: number) => number
  overscan?: number
}

export function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  estimateSize,
  overscan = 5
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: estimateSize || (() => itemHeight),
    overscan
  })

  return (
    <div
      ref={parentRef}
      style={{
        height: `${height}px`,
        overflow: 'auto'
      }}
      className="scrollbar-thin"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            {renderItem(items[virtualRow.index], virtualRow.index)}
          </div>
        ))}
      </div>
    </div>
  )
}
