import React, { useCallback, useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { createPortal } from 'react-dom'
import { usePopper } from 'react-popper'

import { TooltipOptions, TooltipRefs } from './types'

const useTooltip = (
  content: React.ReactNode,
  options: TooltipOptions
): TooltipRefs => {
  const {
    placement = 'auto',
    trigger = 'hover',
    tooltipPadding = { left: 16, right: 16 },
    tooltipOffset = [0, 8],
  } = options
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipElement, setTooltipElement] = useState<HTMLElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null)

  const [visible, setVisible] = useState(false)
  const isHoveringOverTooltip = useRef(false)
  const hideTimeout = useRef<number>()

  const hideTooltip = useCallback(
    (e: Event) => {
      const hide = () => {
        e.stopPropagation()
        e.preventDefault()
        setVisible(false)
      }

      if (trigger === 'hover') {
        if (hideTimeout.current) {
          window.clearTimeout(hideTimeout.current)
        }
        if (e.target === tooltipElement) {
          isHoveringOverTooltip.current = false
        }
        if (!isHoveringOverTooltip.current) {
          hideTimeout.current = window.setTimeout(() => {
            if (!isHoveringOverTooltip.current) {
              hide()
            }
          }, 100)
        }
      } else {
        hide()
      }
    },
    [tooltipElement, trigger]
  )

  const showTooltip = useCallback(
    (e: Event) => {
      e.stopPropagation()
      e.preventDefault()
      setVisible(true)
      if (trigger === 'hover') {
        if (e.target === targetElement) {
          // If we were about to close the tooltip and got back to it
          // then prevent closing it.
          clearTimeout(hideTimeout.current)
        }
        if (e.target === tooltipElement) {
          isHoveringOverTooltip.current = true
        }
      }
    },
    [tooltipElement, targetElement, trigger]
  )

  const toggleTooltip = useCallback(
    (e: Event) => {
      e.stopPropagation()
      setVisible(!visible)
    },
    [visible]
  )

  // Trigger = hover
  useEffect(() => {
    if (targetElement === null || trigger !== 'hover') return undefined

    if (isMobile) {
      targetElement.addEventListener('touchstart', showTooltip)
      targetElement.addEventListener('touchend', hideTooltip)
    } else {
      targetElement.addEventListener('mouseenter', showTooltip)
      targetElement.addEventListener('mouseleave', hideTooltip)
    }
    return () => {
      targetElement.removeEventListener('touchstart', showTooltip)
      targetElement.removeEventListener('touchend', hideTooltip)
      targetElement.removeEventListener('mouseenter', showTooltip)
      targetElement.removeEventListener('mouseleave', showTooltip)
    }
  }, [trigger, targetElement, hideTooltip, showTooltip])

  // Keep tooltip open when cursor moves from the targetElement to the tooltip
  useEffect(() => {
    if (tooltipElement === null || trigger !== 'hover') return undefined

    tooltipElement.addEventListener('mouseenter', showTooltip)
    tooltipElement.addEventListener('mouseleave', hideTooltip)
    return () => {
      tooltipElement.removeEventListener('mouseenter', showTooltip)
      tooltipElement.removeEventListener('mouseleave', hideTooltip)
    }
  }, [trigger, tooltipElement, hideTooltip, showTooltip])

  // Trigger = click
  useEffect(() => {
    if (targetElement === null || trigger !== 'click') return undefined

    targetElement.addEventListener('click', toggleTooltip)

    return () => targetElement.removeEventListener('click', toggleTooltip)
  }, [trigger, targetElement, visible, toggleTooltip])

  // Handle click outside
  useEffect(() => {
    if (trigger !== 'click') return undefined

    const handleClickOutside = ({ target }: Event) => {
      if (target instanceof Node) {
        if (
          tooltipElement != null &&
          targetElement != null &&
          !tooltipElement.contains(target) &&
          !targetElement.contains(target)
        ) {
          setVisible(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [trigger, targetElement, tooltipElement])

  // Trigger = focus
  useEffect(() => {
    if (targetElement === null || trigger !== 'focus') return undefined

    targetElement.addEventListener('focus', showTooltip)
    targetElement.addEventListener('blur', hideTooltip)
    return () => {
      targetElement.removeEventListener('focus', showTooltip)
      targetElement.removeEventListener('blur', hideTooltip)
    }
  }, [trigger, targetElement, showTooltip, hideTooltip])

  // On small screens Popper.js tries to squeeze the tooltip to available space without overflowing beyound the edge
  // of the screen. While it works fine when the element is in the middle of the screen it does not handle well the
  // cases when the target element is very close to the edge of the screen - no margin is applied between the tooltip
  // and the screen edge.
  // preventOverflow mitigates this behavior, default 16px paddings on left and right solve the problem for all screen sizes
  // that we support.
  // Note that in the farm page where there are tooltips very close to the edge of the screen this padding works perfectly
  // even on the iPhone 5 screen (320px wide), BUT in the storybook with the contrived example ScreenEdges example
  // iPhone 5 behaves differently overflowing beyond the edge. All paddings are identical so I have no idea why it is,
  // and fixing that seems like a very bad use of time.
  const { styles, attributes } = usePopper(targetElement, tooltipElement, {
    placement,
    modifiers: [
      {
        name: 'arrow',
        options: { element: arrowElement },
      },
      { name: 'offset', options: { offset: tooltipOffset } },
      { name: 'preventOverflow', options: { padding: tooltipPadding } },
    ],
  })

  const tooltip = (
    <div
      className="tooltip-container z-20 max-w-tooltip rounded p-3 text-xs leading-snug text-white whitespace-no-wrap bg-black shadow-lg"
      ref={setTooltipElement}
      style={styles.popper}
      {...attributes.popper}
    >
      {content}
      <div
        className="tooltip-arrow "
        ref={setArrowElement}
        style={styles.arrow}
      >
        <div className="w-2 h-2 transform rotate-45 bg-black" />
      </div>
    </div>
  )

  const tooltipInPortal = createPortal(
    tooltip,
    document.getElementById('tooltip-portal-root')
  )

  return {
    targetRef: setTargetElement,
    tooltip: tooltipInPortal ?? tooltip,
    tooltipVisible: visible,
  }
}

export default useTooltip
