import { assetPath } from '../assetPath'

const FigmaIcon = () => (
  <svg width="11" height="16" viewBox="0 0 11 16" fill="none" aria-hidden="true">
    <path d="M0 13.25C0 14.769 1.231 16 2.75 16C4.269 16 5.5 14.769 5.5 13.25V10.5H2.75C1.231 10.5 0 11.731 0 13.25Z" fill="#0ACF83"/>
    <path d="M0 8C0 6.481 1.231 5.25 2.75 5.25H5.5V10.75H2.75C1.231 10.75 0 9.519 0 8Z" fill="#A259FF"/>
    <path d="M0 2.75C0 1.231 1.231 0 2.75 0H5.5V5.5H2.75C1.231 5.5 0 4.269 0 2.75Z" fill="#F24E1E"/>
    <path d="M5.5 0H8.25C9.769 0 11 1.231 11 2.75C11 4.269 9.769 5.5 8.25 5.5H5.5V0Z" fill="#FF7262"/>
    <path d="M11 8C11 9.519 9.769 10.75 8.25 10.75C6.731 10.75 5.5 9.519 5.5 8C5.5 6.481 6.731 5.25 8.25 5.25C9.769 5.25 11 6.481 11 8Z" fill="#1ABCFE"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" aria-hidden="true">
    <path d="M7 1.5V10M7 10L3.5 6.5M7 10L10.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 13H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export default function Header({ isDarkMode, onToggleMode }) {
  return (
    <header
      className={`fixed inset-x-0 top-0 min-h-[63px] flex flex-col sm:flex-row sm:items-center justify-center sm:justify-between gap-3 px-5 py-4 sm:px-10 sm:py-0 border-b z-20 ${
        isDarkMode ? 'bg-[#111111] border-[#1f1f1f]' : 'bg-mono-white border-gray-200'
      }`}
    >
      <span
        className={`text-[18px] font-[900] whitespace-nowrap tracking-[-0.2px] ${isDarkMode ? 'text-mono-white' : 'text-mono-black'}`}
        style={{ fontFamily: 'var(--font-line)' }}
      >
        Prototype Preview
      </span>

      <div className="flex items-center gap-[6px]">
        <button
          type="button"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={isDarkMode}
          onClick={onToggleMode}
          className={`flex h-[39px] w-[39px] shrink-0 items-center justify-center rounded-full border-[1px] p-0 cursor-pointer transition-opacity hover:opacity-70 ${
            isDarkMode ? 'border-[#2A2A2A] bg-[#111111] text-mono-white' : 'border-gray-250 bg-mono-white text-gray-900'
          }`}
          style={{ borderWidth: '1px' }}
        >
          <img
            src={assetPath(isDarkMode ? '/Asset/Lightmode_btn.svg' : '/Asset/Darkmode_btn.svg')}
            alt=""
            className="block h-[37px] w-[37px]"
          />
        </button>
        <button
          className={`inline-flex items-center gap-[5px] py-[9px] px-[15px] rounded-full border-[1px] text-[15px] leading-[19px] font-[600] tracking-[-0.2px] cursor-pointer hover:opacity-70 transition-opacity ${
          isDarkMode ? 'border-[#2A2A2A] bg-[#111111] text-mono-white' : 'border-gray-250 bg-mono-white text-gray-900'
        }`}
          style={{ borderWidth: '1px' }}
        >
          <span className="flex h-[17px] w-[14px] shrink-0 items-center justify-center">
            <FigmaIcon />
          </span>
          Figma
        </button>
        <button className="hidden items-center gap-[5px] px-[15px] sm:px-[17px] py-[10px] sm:py-[11px] rounded-full bg-gray-900 text-[15px] leading-[19px] font-[700] text-mono-white cursor-pointer hover:opacity-70 transition-opacity">
          <DownloadIcon />
          Download
        </button>
      </div>
    </header>
  )
}
