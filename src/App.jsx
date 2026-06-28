import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Header from './components/Header'
import FlowOneScreen from './components/FlowOneScreen'
import { assetPath } from './assetPath'
import './App.css'

const SCENARIOS = ['Favorite Nudge', 'B. Book a hair salon', 'C. Book movie tickets']
const FLOW_STEPS = [
  "Select 'Cafe Cove'",
  "Select 'Green Tea Latte'",
  'Tap the Order Button',
  'Tap the Add to Favorites button',
  'Added to My MINI favorites',
]

const PREVIEW_WIDTH = 375
const PREVIEW_HEIGHT = 812
const PREVIEW_OUTLINE_WIDTH = 12
const PREVIEW_SHELL_WIDTH = PREVIEW_WIDTH + PREVIEW_OUTLINE_WIDTH * 2
const PREVIEW_SHELL_HEIGHT = PREVIEW_HEIGHT + PREVIEW_OUTLINE_WIDTH * 2
const DESKTOP_FLOW_WIDTH = 190
const DESKTOP_PREVIEW_FLOW_GAP = 75
const AUTO_PLAY_TIMELINE = [
  { at: 0, flowIndex: 0, cursor: { visible: false, x: 125, y: 365 } },
  { at: 700, cursor: { visible: true, x: 205, y: 500 } },
  { at: 1550, cursor: { visible: true, x: 125, y: 365 } },
  { at: 2050, cursor: { visible: true, x: 125, y: 365, tapping: true } },
  { at: 2650, flowIndex: 1, cursor: { visible: false, x: 125, y: 365 } },
  { at: 3950, cursor: { visible: true, x: 230, y: 525 } },
  { at: 4800, cursor: { visible: true, x: 170, y: 639 } },
  { at: 5300, cursor: { visible: true, x: 170, y: 639, tapping: true } },
  { at: 5900, flowIndex: 2, cursor: { visible: false, x: 170, y: 639 } },
  { at: 6900, cursor: { visible: true, x: 125, y: 690 } },
  { at: 7750, cursor: { visible: true, x: 187.5, y: 750 } },
  { at: 8250, cursor: { visible: true, x: 187.5, y: 750, tapping: true } },
  { at: 8850, flowIndex: 3, cursor: { visible: false, x: 187.5, y: 750 } },
  { at: 11600, cursor: { visible: true, x: 170, y: 650 } },
  { at: 12450, cursor: { visible: true, x: 280, y: 742 } },
  { at: 12950, cursor: { visible: true, x: 280, y: 742, tapping: true } },
  { at: 13550, flowIndex: 4, cursor: { visible: false, x: 280, y: 742 } },
]
const AUTO_PLAY_END_DELAY = 15200

function FlowNumber({ number, selected, isDarkMode }) {
  const fill = selected ? (isDarkMode ? '#FFFFFF' : '#111111') : isDarkMode ? '#777777' : '#b7b7b7'
  const textColor = selected ? (isDarkMode ? '#111111' : '#FFFFFF') : isDarkMode ? '#111111' : '#FFFFFF'

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="mt-[1.5px] shrink-0"
    >
      <rect width="18" height="18" rx="9" fill={fill} />
      <text
        x="9"
        y="9.6"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={textColor}
        fontFamily="var(--font-sf)"
        fontSize="10"
        fontWeight="700"
        letterSpacing="-0.2"
      >
        {number}
      </text>
    </svg>
  )
}

function PhonePreview({
  isDarkMode,
  activeFlowStep,
  activeFlowIndex,
  showClickArea,
  isAutoPlaying,
  scriptedCursor,
  previewScale,
  flowOneResetKey,
  onSelectFlow,
}) {
  const hasImplementedFlow = activeFlowIndex >= 0 && activeFlowIndex < FLOW_STEPS.length
  const previewFrameRef = useRef(null)
  const [touchCursor, setTouchCursor] = useState({ visible: false, x: 0, y: 0 })

  const previewShellStyle = {
    width: `${PREVIEW_SHELL_WIDTH * previewScale}px`,
    height: `${PREVIEW_SHELL_HEIGHT * previewScale}px`,
  }

  const previewInnerStyle = {
    left: `${PREVIEW_OUTLINE_WIDTH * previewScale}px`,
    top: `${PREVIEW_OUTLINE_WIDTH * previewScale}px`,
    width: `${PREVIEW_WIDTH * previewScale}px`,
    height: `${PREVIEW_HEIGHT * previewScale}px`,
  }

  const previewFrameStyle = {
    width: PREVIEW_WIDTH,
    height: PREVIEW_HEIGHT,
    transform: `scale(${previewScale})`,
    transformOrigin: 'top left',
  }

  const handlePreviewMouseMove = (event) => {
    if (scriptedCursor) {
      return
    }

    const frame = previewFrameRef.current

    if (!frame) {
      return
    }

    const rect = frame.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * PREVIEW_WIDTH
    const y = ((event.clientY - rect.top) / rect.height) * PREVIEW_HEIGHT

    setTouchCursor({
      visible: true,
      x: Math.max(0, Math.min(PREVIEW_WIDTH, x)),
      y: Math.max(0, Math.min(PREVIEW_HEIGHT, y)),
    })
  }

  const hideTouchCursor = () => {
    if (scriptedCursor) {
      return
    }

    setTouchCursor((cursor) => ({ ...cursor, visible: false }))
  }

  const displayedTouchCursor = scriptedCursor ?? touchCursor

  return (
    <div
      aria-label={`Prototype preview: ${activeFlowStep}`}
      className="relative shrink-0 overflow-visible"
      style={previewShellStyle}
    >
      <div
        className="absolute overflow-visible"
        style={previewInnerStyle}
      >
        <div
          ref={previewFrameRef}
          onMouseEnter={handlePreviewMouseMove}
          onMouseLeave={hideTouchCursor}
          onMouseMove={handlePreviewMouseMove}
          className={`relative rounded-[42px] outline outline-[12px] overflow-hidden ${
            isDarkMode
              ? 'bg-[#3a3a3a] outline-[rgba(255,255,255,0.1)]'
              : 'bg-gray-300 outline-[rgba(0,0,0,0.05)]'
          } phone-preview-frame`}
          style={previewFrameStyle}
        >
          {hasImplementedFlow ? (
            <FlowOneScreen
              key={flowOneResetKey}
              activeFlowIndex={activeFlowIndex}
              showClickArea={showClickArea}
              autoPlayActive={isAutoPlaying}
              initialModalOpen={
                activeFlowIndex >= 1 &&
                activeFlowIndex <= 4 &&
                !(isAutoPlaying && activeFlowIndex === 1)
              }
              onRequestFlowIndex={onSelectFlow}
            />
          ) : (
            <div className="flex h-full flex-col justify-end p-6">
              <div
                key={activeFlowStep}
                className={`rounded-[28px] px-5 py-4 transition-colors duration-200 ${
                  isDarkMode ? 'bg-[#2A2A2A] text-mono-white' : 'bg-mono-white text-gray-900'
                }`}
              >
                <p className="m-0 text-[15px] font-[600] leading-5 tracking-[-0.12px]">
                  {activeFlowStep}
                </p>
              </div>
            </div>
          )}
          <img
            src={assetPath('/Asset/Touch_cursor.png')}
            alt=""
            aria-hidden="true"
            className={`phone-touch-cursor ${displayedTouchCursor.visible ? 'is-visible' : ''} ${
              scriptedCursor ? 'is-scripted' : ''
            } ${displayedTouchCursor.tapping ? 'is-tapping' : ''} ${
              displayedTouchCursor.pressing ? 'is-pressing' : ''
            }`}
            style={{
              '--touch-cursor-x': `${displayedTouchCursor.x}px`,
              '--touch-cursor-y': `${displayedTouchCursor.y}px`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

function ScenarioList({ active, isAutoPlaying, onChange, onToggleAutoPlay, isDarkMode }) {
  return (
    <div className="flex w-full max-w-[420px] flex-col gap-[2px] lg:w-[284px]">
      {SCENARIOS.slice(0, 1).map((scenario) => {
        const selected = scenario === active
        const canAutoPlay = scenario === SCENARIOS[0]
        const playbackIcon = isAutoPlaying
          ? isDarkMode ? '/Asset/Pause_btn.svg' : '/Asset/Pause.svg'
          : isDarkMode ? '/Asset/Play_btn.svg' : '/Asset/Play.svg'

        return (
          <div
            key={scenario}
            className={`flex h-[56px] cursor-pointer items-center justify-between rounded-[11px] border-none px-[18px] py-0 text-left text-[16px] leading-[22px] tracking-[-0.22px] transition-colors duration-150 ${
              selected
                ? isDarkMode
                  ? 'bg-[#252525] text-mono-white font-[600]'
                  : 'bg-gray-150 text-gray-900 font-[600]'
                : isDarkMode
                  ? 'bg-transparent text-[#949494] font-[500] hover:text-mono-white'
                  : 'bg-transparent text-gray-530 font-[500] hover:text-gray-900'
            }`}
          >
            <button
              type="button"
              onClick={canAutoPlay ? onToggleAutoPlay : () => onChange(scenario)}
              className="m-0 flex h-full min-w-0 flex-1 cursor-pointer items-center border-none bg-transparent p-0 text-inherit"
            >
              <span className="truncate">{scenario}</span>
            </button>
            {canAutoPlay ? (
              <button
                type="button"
                aria-label={isAutoPlaying ? 'Pause scenario playback' : 'Play scenario'}
                onClick={onToggleAutoPlay}
                className="m-0 ml-3 flex h-[36px] w-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0"
              >
                <img
                  src={assetPath(playbackIcon)}
                  alt=""
                  aria-hidden="true"
                  className={`block translate-x-[4px] ${isDarkMode ? 'h-[36px] w-[36px]' : 'h-[22px] w-[22px]'}`}
                  draggable={false}
                />
              </button>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function ScreenFlow({ activeFlowIndex, isDarkMode, onSelectFlow }) {
  return (
    <div className="flex w-[190px] shrink-0 flex-col items-start">
      <div className="flex flex-col gap-9">
        {FLOW_STEPS.map((step, index) => {
          const selected = index === activeFlowIndex

          return (
            <button
              key={`${step}-${index}`}
              type="button"
              aria-current={selected ? 'step' : undefined}
              onClick={() => onSelectFlow(index)}
              className={`m-0 flex w-full cursor-pointer items-start gap-[10px] whitespace-nowrap border-none bg-transparent p-0 text-left text-[16px] leading-[22px] tracking-[-0.22px] transition-colors duration-150 ${
                selected
                  ? isDarkMode
                    ? 'text-mono-white font-[600]'
                    : 'text-gray-900 font-[600]'
                  : isDarkMode
                    ? 'text-[#949494] font-[500]'
                  : 'text-gray-530 font-[500]'
              }`}
            >
              <FlowNumber number={index + 1} selected={selected} isDarkMode={isDarkMode} />
              <span>{step}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function App() {
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0])
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [activeFlowIndex, setActiveFlowIndex] = useState(0)
  const [flowOneResetKey, setFlowOneResetKey] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [autoPlayCursor, setAutoPlayCursor] = useState(null)
  const previewStageRef = useRef(null)
  const autoPlayTimersRef = useRef([])
  const [previewScale, setPreviewScale] = useState(1)
  const showClickArea = !isAutoPlaying

  const clearAutoPlayTimers = useCallback(() => {
    autoPlayTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    autoPlayTimersRef.current = []
  }, [])

  const stopAutoPlay = useCallback(() => {
    clearAutoPlayTimers()
    setIsAutoPlaying(false)
    setAutoPlayCursor(null)
  }, [clearAutoPlayTimers])

  const startAutoPlay = useCallback(() => {
    clearAutoPlayTimers()
    setActiveScenario(SCENARIOS[0])
    setIsAutoPlaying(true)
    setFlowOneResetKey((value) => value + 1)
    setActiveFlowIndex(0)
    setAutoPlayCursor(AUTO_PLAY_TIMELINE[0].cursor)

    autoPlayTimersRef.current = [
      ...AUTO_PLAY_TIMELINE.slice(1).map((step) =>
        window.setTimeout(() => {
          if (Object.hasOwn(step, 'flowIndex')) {
            setActiveFlowIndex(step.flowIndex)
          }

          if (Object.hasOwn(step, 'cursor')) {
            setAutoPlayCursor(step.cursor)
          }
        }, step.at),
      ),
      window.setTimeout(() => {
        setIsAutoPlaying(false)
        setAutoPlayCursor(null)
      }, AUTO_PLAY_END_DELAY),
    ]
  }, [clearAutoPlayTimers])

  const handleSelectFlow = (index) => {
    if (isAutoPlaying) {
      stopAutoPlay()
    }

    setActiveFlowIndex(index)

    if (index === 0 || index === 1) {
      setFlowOneResetKey((value) => value + 1)
    }
  }

  const handlePrototypeRequestFlow = (index) => {
    if (isAutoPlaying) {
      stopAutoPlay()
    }

    setActiveFlowIndex(index)
  }

  const handleSelectScenario = (scenario) => {
    if (scenario === SCENARIOS[0]) {
      startAutoPlay()
      return
    }

    stopAutoPlay()
    setActiveScenario(scenario)
  }

  const handleToggleScenarioAutoPlay = () => {
    if (isAutoPlaying) {
      stopAutoPlay()
      return
    }

    startAutoPlay()
  }

  useEffect(() => {
    return () => {
      clearAutoPlayTimers()
    }
  }, [clearAutoPlayTimers])

  useLayoutEffect(() => {
    const updatePreviewScale = () => {
      const stage = previewStageRef.current

      if (!stage) {
        return
      }

      const rect = stage.getBoundingClientRect()
      const isDesktop = window.innerWidth >= 1024
      const reservedFlowWidth = isDesktop ? DESKTOP_FLOW_WIDTH + DESKTOP_PREVIEW_FLOW_GAP : 0
      const widthScale = (rect.width - reservedFlowWidth) / PREVIEW_SHELL_WIDTH
      const heightScale = rect.height / PREVIEW_SHELL_HEIGHT

      setPreviewScale(Math.max(0.2, Math.min(1, widthScale, heightScale)))
    }

    updatePreviewScale()

    const resizeObserver = new ResizeObserver(updatePreviewScale)
    const stage = previewStageRef.current

    if (stage) {
      resizeObserver.observe(stage)
    }

    window.addEventListener('resize', updatePreviewScale)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updatePreviewScale)
    }
  }, [])

  return (
    <div className={`h-[100dvh] overflow-hidden flex flex-col ${isDarkMode ? 'bg-[#111111]' : 'bg-mono-white'}`}>
      <Header isDarkMode={isDarkMode} onToggleMode={() => setIsDarkMode((value) => !value)} />

      <div className="mt-[112px] flex h-[calc(100dvh-112px)] flex-col overflow-hidden sm:mt-[63px] sm:h-[calc(100dvh-63px)] lg:flex-row">
        {/* Left panel */}
        <aside
          className={`w-full lg:w-[364px] shrink-0 border-b lg:border-b-0 lg:border-r relative flex flex-col overflow-visible lg:overflow-hidden px-6 py-8 sm:px-10 lg:p-0 ${
            isDarkMode ? 'border-[#1f1f1f]' : 'border-gray-200'
          }`}
        >
          {/* Title, description + scenarios */}
          <div className="static lg:absolute lg:top-[60px] lg:left-10 flex flex-col">
            <div className="flex flex-col gap-4">
              <h1 className={`text-[32px] font-[800] leading-[38px] tracking-[-0.86px] whitespace-pre-wrap m-0 ${isDarkMode ? 'text-mono-white' : 'text-gray-900'}`}>
                {'MINI Tab\nFavorite Nudge'}
              </h1>
              <p className={`w-full max-w-[420px] whitespace-pre-line lg:w-[284px] text-[15px] font-[300] leading-[20px] tracking-[0.2px] m-0 ${isDarkMode ? 'text-[#949494]' : 'text-gray-700'}`}>
                {'A scenario-based prototype flow showing how Agent i in MINI Tab helps users naturally add the MINI they used to their favorites.'}
              </p>
            </div>

            <div className="mt-[52px]">
              <p className={`m-0 text-[18px] font-[700] leading-normal tracking-[-0.5px] ${isDarkMode ? 'text-mono-white' : 'text-gray-900'}`}>
                Scenarios
              </p>
              <div className="mt-[18px]">
                <ScenarioList
                  active={activeScenario}
                  isAutoPlaying={isAutoPlaying}
                  onChange={handleSelectScenario}
                  onToggleAutoPlay={handleToggleScenarioAutoPlay}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>

        </aside>

        {/* Right panel */}
        <section className={`flex-1 min-h-0 min-w-0 flex flex-col items-center overflow-hidden lg:h-full px-4 py-[50px] lg:px-0 ${
          isDarkMode ? 'bg-[#111111]' : 'bg-mono-white'
        }`}>
          <div ref={previewStageRef} className="flex min-h-0 w-full flex-1 items-center justify-center overflow-visible">
            <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-[75px] lg:-translate-x-[68px]">
              <div className="shrink-0">
                <PhonePreview
                  isDarkMode={isDarkMode}
                  activeFlowStep={FLOW_STEPS[activeFlowIndex]}
                  activeFlowIndex={activeFlowIndex}
                  showClickArea={showClickArea}
                  isAutoPlaying={isAutoPlaying}
                  scriptedCursor={autoPlayCursor}
                  previewScale={previewScale}
                  flowOneResetKey={flowOneResetKey}
                  onSelectFlow={handlePrototypeRequestFlow}
                />
              </div>
              <ScreenFlow
                activeFlowIndex={activeFlowIndex}
                isDarkMode={isDarkMode}
                onSelectFlow={handleSelectFlow}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
