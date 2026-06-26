import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { assetPath } from '../assetPath'

const GNB_IMAGE = assetPath('/flow_01/GNB_1125.png?v=2')
const FULL_SCREEN_IMAGE = assetPath('/flow_01/full-image.png?v=20260626')
const ORDER_IMAGE = assetPath('/flow_01/order.png?v=20260626-2')
const ORDER_COMPLETE_IMAGE = assetPath('/flow_01/order_complete.png?v=20260626-2')
const ORDER_COMPLETE_CHECK_IMAGE = assetPath('/flow_01/check-image.png?v=20260626')
const ORDER_COMPLETE_POPUP_IMAGE = assetPath('/flow_01/order-complete-popup.png?v=20260626-3')
const ORDER_COMPLETE_POPUP_LOGO_IMAGE = assetPath(
  '/flow_01/order-complete-popup-logo.png?v=20260626',
)
const ORDER_COUNT_PLUS_IMAGE = assetPath('/flow_01/count-plus.png?v=20260626')
const ORDER_COUNT_MINUS_IMAGE = assetPath('/flow_01/count-minus.png?v=20260626')
const AGENT_ICON = assetPath('/flow_01/ai-agent-primary.png')
const RECOMMENDED_TOP = 583
const RECOMMENDED_HEIGHT = 143
const AUTO_PLAY_PROMPT_SCROLL_EXTRA = 212
const AUTO_PLAY_PROMPT_SCROLL_DELAY = 900
const AUTO_PLAY_PROMPT_SCROLL_DURATION = 680
const GNB_HEIGHT = 84
const BOUNCE_MAX = 30
const BOUNCE_RESISTANCE = 0.22
const BOUNCE_RETURN_DELAY = 120
const WHEEL_EDGE_UNLOCK_DELAY = 260
const PROMPT_MODAL_OPEN_DELAY = 180
const FLOW_STEP_SYNC_DELAY = 480
const MODAL_SWIPE_HINT_READY_DELAY = 500
const CLICK_HINT_READY_DELAY = 500

const myMiniGroups = [
  {
    title: 'お気に入り',
    items: [
      { icon: 'logo_1.png', label: 'ピック＆\nゴー' },
      { icon: 'logo_2.png', label: 'どんぶり' },
      { icon: 'logo_3.png', label: 'カフェグレ\nイズ' },
      { icon: 'logo_4.png', label: 'アーバン\nコーヒー' },
    ],
  },
  {
    title: '履歴',
    items: [
      { icon: 'logo_5.png', label: 'スタック\nバーガー' },
      { icon: 'logo_6.png', label: 'カフェ\nコーブ' },
      { icon: 'logo_7.png', label: 'ラウン\nディー' },
      { icon: 'logo_8.png', label: 'ブリュー\nコーヒー' },
    ],
  },
  {
    title: 'おすすめ',
    items: [
      { icon: 'logo_9.png', label: 'カフェブラ\nウン' },
      { icon: 'logo_10.png', label: '眼鏡工場' },
      { icon: 'logo_11.png', label: 'ダブリュー\nサロン' },
      { icon: 'logo_12.png', label: 'コアエッジ' },
    ],
  },
]

const prompts = [
  'What nearby restaurants can I visit now?',
  'Restaurants I can book with my coupons?',
  'Restaurants with short waits?',
  'Help me decide what to eat',
  'Most booked restaurants right now?',
  'Best ramen spots in Shibuya?',
]

const promptWidths = [307, 314, 234, 221, 278, 235]

function FlowHintCursor({
  className = '',
  type = 'tap',
  visible = true,
  x,
  y,
  width = 56,
  height = 56,
}) {
  return (
    <span
      aria-hidden="true"
      className={`interaction-cursor interaction-cursor--${type} flow-one-hint-cursor ${
        visible ? 'is-visible' : ''
      } ${className}`}
      style={{
        '--cursor-x': `${x}px`,
        '--cursor-y': `${y}px`,
        '--cursor-width': `${width}px`,
        '--cursor-height': `${height}px`,
      }}
    >
      <span className="interaction-cursor__track" />
      <span className="interaction-cursor__dot" />
    </span>
  )
}

function DelayedFlowHintCursor({
  delay = CLICK_HINT_READY_DELAY,
  visible = true,
  ...props
}) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const resetTimer = window.setTimeout(() => {
      setIsReady(false)
    }, 0)

    const readyTimer = visible
      ? window.setTimeout(() => {
          setIsReady(true)
        }, delay)
      : null

    return () => {
      window.clearTimeout(resetTimer)

      if (readyTimer) {
        window.clearTimeout(readyTimer)
      }
    }
  }, [delay, visible])

  return isReady ? <FlowHintCursor {...props} visible /> : null
}

function FlowOneMyMiniStrip({ aligned = false, showOrderNoti = false }) {
  return (
    <section
      className={`flow-one-my-mini-strip ${aligned ? 'is-aligned-left' : ''} ${
        showOrderNoti ? 'has-order-noti' : ''
      }`}
      aria-label="My MINI"
    >
      {showOrderNoti ? (
        <article className="flow-one-my-mini-strip__order-noti" aria-label="Order notification">
          <img
            src={assetPath('/flow_01/order-noti-coffee.png?v=20260626')}
            alt=""
            className="flow-one-my-mini-strip__order-noti-image"
            aria-hidden="true"
            draggable={false}
          />
          <p>
            ご注文を承りました
            <br />
            注文番号 63
          </p>
        </article>
      ) : null}
      {myMiniGroups.map((group, index) => (
        <article
          className="flow-one-my-mini-strip__card"
          data-card-index={index}
          key={group.title}
        >
          <header className="flow-one-my-mini-strip__title">
            <h3>{group.title}</h3>
            <img
              src={assetPath('/flow_01/arrow.png?v=20260626')}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          </header>
          <div
            className={`flow-one-my-mini-strip__items ${
              showOrderNoti && index === 0 ? 'has-covo-coffee' : ''
            }`}
          >
            {showOrderNoti && index === 0 ? (
              <div className="flow-one-my-mini-strip__item flow-one-my-mini-strip__item--covo-coffee">
                <div className="flow-one-my-mini-strip__item-inner">
                  <img
                    src={assetPath('/flow_01/logo_6.png?v=20260626')}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                  />
                  <span>カフェ{'\n'}コーブ</span>
                </div>
              </div>
            ) : null}
            {group.items.map((item) => (
              <div className="flow-one-my-mini-strip__item" key={`${group.title}-${item.icon}`}>
                <img
                  src={assetPath(`/flow_01/${item.icon}?v=20260626`)}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  )
}

function OrderModal({ visible, activeFlowIndex, onRequestFlowIndex }) {
  const showAddHint = activeFlowIndex <= 1
  const showOrderHint = activeFlowIndex === 2

  return (
    <div className="flow-one-order-modal-layer">
      <div
        aria-hidden="true"
        className={`flow-one-order-modal-dim ${visible ? 'is-visible' : ''}`}
      />
      <section
        aria-label="Cafe Cove order"
        className={`flow-one-order-modal ${visible ? 'is-visible' : ''}`}
      >
        <div className="flow-one-order-modal__status" aria-hidden="true" />
        <div className="flow-one-order-modal__sheet">
          <img
            src={ORDER_IMAGE}
            alt=""
            className="flow-one-order-modal__image"
            aria-hidden="true"
            draggable={false}
          />
          {showOrderHint ? (
            <div className="flow-one-order-count" aria-hidden="true">
              <img
                src={ORDER_COUNT_MINUS_IMAGE}
                alt=""
                className="flow-one-order-count__minus"
                draggable={false}
              />
              <span className="flow-one-order-count__value">1</span>
              <img
                src={ORDER_COUNT_PLUS_IMAGE}
                alt=""
                className="flow-one-order-count__plus"
                draggable={false}
              />
            </div>
          ) : null}
        </div>
        <button
          type="button"
          className="flow-one-order-modal__order-button"
          onClick={() => onRequestFlowIndex?.(3)}
        >
          {showOrderHint ? '注文する (1)' : '注文する'}
        </button>
        <button
          type="button"
          className="flow-one-order-touch-target"
          aria-label="Add green tea latte"
          onClick={() => onRequestFlowIndex?.(2)}
        />
        <button
          type="button"
          className="flow-one-order-button-touch-target"
          aria-label="Place order"
          onClick={() => onRequestFlowIndex?.(3)}
        />
        <FlowHintCursor
          className="phone-green-touch-cursor flow-one-order-touch-cursor"
          type="tap"
          visible={visible && showAddHint}
          x={142}
          y={611}
          width={56}
          height={56}
        />
        <FlowHintCursor
          className="phone-green-touch-cursor flow-one-order-button-touch-cursor"
          type="tap"
          visible={visible && showOrderHint}
          x={159.5}
          y={717}
          width={56}
          height={56}
        />
      </section>
    </div>
  )
}

function OrderCompleteModal({ visible, onRequestFlowIndex }) {
  return (
    <section
      aria-label="Order complete"
      className={`flow-one-order-complete-modal ${visible ? 'is-visible' : ''}`}
    >
      <img
        src={ORDER_COMPLETE_IMAGE}
        alt=""
        className="flow-one-order-complete-modal__image"
        aria-hidden="true"
        draggable={false}
      />
      <div className="flow-one-order-complete-modal__info" aria-hidden="true">
        <div className="flow-one-order-complete-modal__check">
          <span className="flow-one-order-complete-modal__check-draw">
            <img
              src={ORDER_COMPLETE_CHECK_IMAGE}
              alt=""
              className="flow-one-order-complete-modal__check-image"
              draggable={false}
            />
          </span>
        </div>
        <div className="flow-one-order-complete-modal__title-group">
          <div className="flow-one-order-complete-modal__title">ご注文が完了しました</div>
          <div className="flow-one-order-complete-modal__subtitle">受け取り予定 5分後</div>
        </div>
      </div>
      <div className="flow-one-order-complete-modal__popup-dim" aria-hidden="true" />
      <img
        src={ORDER_COMPLETE_POPUP_IMAGE}
        alt=""
        className="flow-one-order-complete-modal__popup"
        aria-hidden="true"
        draggable={false}
      />
      <img
        src={ORDER_COMPLETE_POPUP_LOGO_IMAGE}
        alt=""
        className="flow-one-order-complete-modal__popup-logo"
        aria-hidden="true"
        draggable={false}
      />
      <FlowHintCursor
        className="phone-green-touch-cursor flow-one-order-complete-popup-touch-cursor"
        type="tap"
        visible={visible}
        x={252}
        y={714}
        width={56}
        height={56}
      />
      <button
        type="button"
        className="flow-one-order-complete-popup-touch-target"
        aria-label="Add to My MINI favorites"
        onClick={() => onRequestFlowIndex?.(4)}
      />
    </section>
  )
}

function RecommendedForYou({ isPromptExpanded, onFirstPromptSelect }) {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const wheelEdgeRef = useRef({
    returnTimer: null,
    side: 0,
    unlockTimer: null,
  })
  const dragRef = useRef({
    dragging: false,
    maxScroll: 0,
    pointerId: null,
    pressed: false,
    startScroll: 0,
    startX: 0,
    startY: 0,
    suppressClick: false,
  })

  const getDragState = (clientX, clientY) => {
    const viewport = viewportRef.current

    if (!viewport) {
      return null
    }

    return {
      dragging: false,
      maxScroll: Math.max(0, viewport.scrollWidth - viewport.clientWidth),
      pointerId: null,
      pressed: true,
      startScroll: viewport.scrollLeft,
      startX: clientX,
      startY: clientY,
      suppressClick: false,
    }
  }

  const setTrackOffset = (offset, animated = false, duration = 260) => {
    const track = trackRef.current

    if (!track) {
      return
    }

    track.style.transition = animated ? `transform ${duration}ms cubic-bezier(0.18, 0.82, 0.22, 1)` : 'none'
    track.style.transform = `translate3d(${offset}px, 0, 0)`
  }

  const getBounceOffset = (distance, side) => {
    return side * Math.min(BOUNCE_MAX, distance * BOUNCE_RESISTANCE)
  }

  const clearWheelEdge = () => {
    const edge = wheelEdgeRef.current

    if (edge.returnTimer) {
      window.clearTimeout(edge.returnTimer)
      edge.returnTimer = null
    }

    if (edge.unlockTimer) {
      window.clearTimeout(edge.unlockTimer)
      edge.unlockTimer = null
    }

    edge.side = 0
  }

  const triggerWheelBounce = (side, distance) => {
    const edge = wheelEdgeRef.current

    if (edge.unlockTimer) {
      window.clearTimeout(edge.unlockTimer)
    }

    edge.unlockTimer = window.setTimeout(() => {
      edge.side = 0
      edge.unlockTimer = null
    }, WHEEL_EDGE_UNLOCK_DELAY)

    if (edge.side === side) {
      return
    }

    if (edge.returnTimer) {
      window.clearTimeout(edge.returnTimer)
    }

    edge.side = side
    setTrackOffset(getBounceOffset(distance, side))

    edge.returnTimer = window.setTimeout(() => {
      setTrackOffset(0, true)
      edge.returnTimer = null
    }, BOUNCE_RETURN_DELAY)
  }

  const moveDrag = (clientX, clientY) => {
    const viewport = viewportRef.current
    const drag = dragRef.current

    if (!viewport || !drag.pressed) {
      return
    }

    const deltaX = clientX - drag.startX
    const deltaY = clientY - drag.startY
    const isHorizontalIntent = Math.abs(deltaX) > Math.abs(deltaY) + 4

    if (!drag.dragging && Math.abs(deltaX) > 4 && isHorizontalIntent) {
      drag.dragging = true
      viewport.classList.add('is-dragging')
    }

    if (!drag.dragging) {
      return
    }

    const targetScroll = drag.startScroll - deltaX
    let bounceOffset = 0

    if (targetScroll < 0) {
      viewport.scrollLeft = 0
      bounceOffset = getBounceOffset(-targetScroll, 1)
    } else if (targetScroll > drag.maxScroll) {
      viewport.scrollLeft = drag.maxScroll
      bounceOffset = getBounceOffset(targetScroll - drag.maxScroll, -1)
    } else {
      viewport.scrollLeft = targetScroll
    }

    setTrackOffset(bounceOffset)
  }

  const endDrag = () => {
    const viewport = viewportRef.current
    const drag = dragRef.current

    if (!drag.pressed) {
      return
    }

    if (drag.dragging) {
      drag.suppressClick = true
      window.setTimeout(() => {
        drag.suppressClick = false
      }, 120)
    }

    viewport?.classList.remove('is-dragging')
    setTrackOffset(0, true, 420)

    drag.pressed = false
    drag.dragging = false
    drag.pointerId = null
  }

  const handleMouseDown = (event) => {
    if (event.button !== 0) {
      return
    }

    const state = getDragState(event.clientX, event.clientY)

    if (!state) {
      return
    }

    dragRef.current = state
    setTrackOffset(0)

    const handleMouseMove = (moveEvent) => {
      moveDrag(moveEvent.clientX, moveEvent.clientY)

      if (dragRef.current.dragging) {
        moveEvent.preventDefault()
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      endDrag()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (event) => {
    if (event.touches.length !== 1) {
      return
    }

    const touch = event.touches[0]
    const state = getDragState(touch.clientX, touch.clientY)

    if (!state) {
      return
    }

    dragRef.current = state
    setTrackOffset(0)
  }

  const handleTouchMove = (event) => {
    if (event.touches.length !== 1) {
      return
    }

    const touch = event.touches[0]

    moveDrag(touch.clientX, touch.clientY)

    if (dragRef.current.dragging) {
      event.preventDefault()
    }
  }

  const handleClickCapture = (event) => {
    if (dragRef.current.suppressClick) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const handleWheel = (event) => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const delta = Math.abs(event.deltaX) >= Math.abs(event.deltaY) ? event.deltaX : 0

    if (!delta) {
      return
    }

    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth)
    const targetScroll = viewport.scrollLeft + delta

    if (targetScroll < 0) {
      event.preventDefault()
      viewport.scrollLeft = 0
      triggerWheelBounce(1, -targetScroll)
    } else if (targetScroll > maxScroll) {
      event.preventDefault()
      viewport.scrollLeft = maxScroll
      triggerWheelBounce(-1, targetScroll - maxScroll)
    } else if (wheelEdgeRef.current.side) {
      clearWheelEdge()
      setTrackOffset(0, true)
    }
  }

  return (
    <section className="flow-one-recommended" aria-label="Recommended for you">
      <header className="flow-one-recommended__header">
        <img src={AGENT_ICON} alt="" className="flow-one-recommended__icon" draggable={false} />
        <h2>Recommended for you</h2>
      </header>
      <div
        className="flow-one-recommended__prompts-viewport"
        ref={viewportRef}
        onClickCapture={handleClickCapture}
        onMouseDown={handleMouseDown}
        onTouchCancel={endDrag}
        onTouchEnd={endDrag}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onWheel={handleWheel}
      >
        <div
          className={`flow-one-recommended__prompts ${
            isPromptExpanded ? 'is-prompt-expanded' : ''
          }`}
          ref={trackRef}
        >
          {prompts.map((prompt, index) => (
            <div
              key={prompt}
              className={`flow-one-prompt-slot ${
                index === 0 && isPromptExpanded ? 'flow-one-prompt-slot--expanded' : ''
              }`}
              style={{ '--prompt-width': `${promptWidths[index]}px` }}
            >
              <button
                type="button"
                className={`flow-one-prompt ${
                  index === 0 && isPromptExpanded ? 'flow-one-prompt--expanded' : ''
                }`}
                onClick={index === 0 ? onFirstPromptSelect : undefined}
              >
                {prompt}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function FlowOneScreen({
  activeFlowIndex = 0,
  showClickArea = false,
  autoPlayActive = false,
  initialModalOpen = false,
  onRequestFlowIndex,
}) {
  const scrollRef = useRef(null)
  const promptTimerRef = useRef(null)
  const modalTimerRef = useRef(null)
  const [isClickAreaMeasured, setIsClickAreaMeasured] = useState(false)
  const [isRecommendedReady, setIsRecommendedReady] = useState(false)
  const [isPromptExpanded, setIsPromptExpanded] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const hasPromptExpanded = isPromptExpanded || (autoPlayActive && activeFlowIndex === 1)
  const showFlowOneHints = showClickArea && activeFlowIndex === 0

  useEffect(() => {
    if (!initialModalOpen) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setIsModalVisible(true)
    }, 80)

    return () => {
      window.clearTimeout(timer)
    }
  }, [initialModalOpen])

  useEffect(() => {
    const scroller = scrollRef.current

    if (!scroller || !autoPlayActive || activeFlowIndex !== 0) {
      return undefined
    }

    let animationFrame = 0

    const timer = window.setTimeout(() => {
      const startTime = window.performance.now()
      const startScroll = scroller.scrollTop
      const targetScroll = Math.max(
        0,
        RECOMMENDED_TOP +
          RECOMMENDED_HEIGHT -
          (scroller.clientHeight - GNB_HEIGHT) +
          AUTO_PLAY_PROMPT_SCROLL_EXTRA,
      )
      const distance = targetScroll - startScroll

      const animate = (time) => {
        const progress = Math.min(1, (time - startTime) / AUTO_PLAY_PROMPT_SCROLL_DURATION)
        const easedProgress = 1 - Math.pow(1 - progress, 3)

        scroller.scrollTop = startScroll + distance * easedProgress

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(animate)
          return
        }

        scroller.scrollTop = targetScroll
      }

      animationFrame = window.requestAnimationFrame(animate)
    }, AUTO_PLAY_PROMPT_SCROLL_DELAY)

    return () => {
      window.clearTimeout(timer)

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }
    }
  }, [activeFlowIndex, autoPlayActive])

  useEffect(() => {
    if (!autoPlayActive || activeFlowIndex !== 1) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setIsModalVisible(true)
    }, PROMPT_MODAL_OPEN_DELAY)

    return () => {
      window.clearTimeout(timer)
    }
  }, [activeFlowIndex, autoPlayActive])

  useEffect(() => {
    return () => {
      if (promptTimerRef.current) {
        window.clearTimeout(promptTimerRef.current)
      }

      if (modalTimerRef.current) {
        window.clearTimeout(modalTimerRef.current)
      }
    }
  }, [])

  useLayoutEffect(() => {
    const scroller = scrollRef.current

    if (!scroller || !showClickArea) {
      setIsClickAreaMeasured(false)
      setIsRecommendedReady(false)
      return undefined
    }

    let animationFrame = 0

    const updateRecommendedVisibility = () => {
      animationFrame = 0

      const unobscuredViewportHeight = scroller.clientHeight - GNB_HEIGHT
      const threshold = Math.max(
        0,
        RECOMMENDED_TOP + RECOMMENDED_HEIGHT - unobscuredViewportHeight,
      )
      const isReady = scroller.scrollTop >= threshold - 1

      setIsRecommendedReady((current) => (current === isReady ? current : isReady))
      setIsClickAreaMeasured(true)
    }

    const scheduleUpdate = () => {
      if (animationFrame) {
        return
      }

      animationFrame = window.requestAnimationFrame(updateRecommendedVisibility)
    }

    updateRecommendedVisibility()
    scroller.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }

      scroller.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [showClickArea])

  const handleFirstPromptSelect = () => {
    if (isModalVisible) {
      return
    }

    if (promptTimerRef.current) {
      window.clearTimeout(promptTimerRef.current)
    }

    if (modalTimerRef.current) {
      window.clearTimeout(modalTimerRef.current)
    }

    setIsPromptExpanded(true)

    promptTimerRef.current = window.setTimeout(() => {
      setIsModalVisible(true)
    }, PROMPT_MODAL_OPEN_DELAY)

    modalTimerRef.current = window.setTimeout(() => {
      onRequestFlowIndex?.(1)
    }, FLOW_STEP_SYNC_DELAY)
  }

  const isOrderModalRendered = isModalVisible && activeFlowIndex <= 2
  const isOrderCompleteRendered = isModalVisible && activeFlowIndex === 3
  return (
    <div className="flow-one-screen">
      {showFlowOneHints ? (
        <div className="flow-one-fixed-hint-layer">
          <DelayedFlowHintCursor
            className="flow-one-scroll-hint"
            type="scroll"
            visible={isClickAreaMeasured && !isRecommendedReady && !hasPromptExpanded}
            delay={MODAL_SWIPE_HINT_READY_DELAY}
            x={159.5}
            y={346}
            width={56}
            height={120}
          />
        </div>
      ) : null}

      <main ref={scrollRef} className="flow-one-scroll" aria-label="Flow 1 scrollable content">
        <div className="flow-one-scroll-content">
          <RecommendedForYou
            isPromptExpanded={hasPromptExpanded}
            onFirstPromptSelect={handleFirstPromptSelect}
          />
          {showFlowOneHints ? (
            <FlowHintCursor
              className="flow-one-prompt-hint"
              type="tap"
              visible={isClickAreaMeasured && isRecommendedReady && !hasPromptExpanded}
              x={134}
              y={617}
              width={56}
              height={56}
            />
          ) : null}
        </div>
      </main>

      <img
        className="flow-one-full-image-overlay"
        src={FULL_SCREEN_IMAGE}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <FlowOneMyMiniStrip aligned={activeFlowIndex === 4} showOrderNoti={activeFlowIndex === 4} />
      {activeFlowIndex !== 4 ? (
        <>
          <button
            type="button"
            className="flow-one-cafe-cove-touch-target"
            aria-label="Select Cafe Cove"
            onClick={handleFirstPromptSelect}
          />
          <FlowHintCursor
            className="phone-green-touch-cursor flow-one-cafe-cove-touch-cursor"
            type="tap"
            visible
            x={97}
            y={337}
            width={56}
            height={56}
          />
        </>
      ) : null}
      <img className="flow-one-gnb" src={GNB_IMAGE} alt="" aria-hidden="true" />
      <OrderModal
        visible={isOrderModalRendered}
        activeFlowIndex={activeFlowIndex}
        onRequestFlowIndex={onRequestFlowIndex}
      />
      <OrderCompleteModal
        visible={isOrderCompleteRendered}
        onRequestFlowIndex={onRequestFlowIndex}
      />
    </div>
  )
}
