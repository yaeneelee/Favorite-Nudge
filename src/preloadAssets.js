// Critical assets that should be preloaded immediately
const CRITICAL_ASSETS = [
  '/Asset/Touch_cursor.png',
  '/Asset/Play_btn.svg',
  '/Asset/Pause_btn.svg',
  '/Asset/Play.svg',
  '/Asset/Pause.svg',
  '/Asset/Lightmode_btn.svg',
  '/Asset/Darkmode_btn.svg',
]

// Flow images - preload in background
const FLOW_IMAGES = [
  '/flow_01/GNB_1125.png',
  '/flow_01/logo_1.png',
  '/flow_01/logo_2.png',
  '/flow_01/logo_3.png',
  '/flow_01/logo_4.png',
  '/flow_01/logo_5.png',
  '/flow_01/logo_6.png',
  '/flow_01/logo_7.png',
  '/flow_01/logo_8.png',
  '/flow_01/logo_9.png',
  '/flow_01/logo_10.png',
  '/flow_01/logo_11.png',
  '/flow_01/logo_12.png',
  '/flow_01/order.png',
  '/flow_01/arrow.png',
  '/flow_01/count-plus.png',
  '/flow_01/count-minus.png',
  '/flow_01/full-image.png',
  '/flow_01/check-image.png',
  '/flow_01/ai-agent-primary.png',
  '/flow_01/order-noti-coffee.png',
  '/flow_01/order-complete-popup.png',
  '/flow_01/order-complete-popup-logo.png',
  '/flow_01/order_complete.png',
]

// Fonts - subset of most used weights
const FONTS = [
  { url: '/Font/SF-Pro-Text/SF-Pro-Text-Regular.otf', family: 'SF Pro Text', weight: '400' },
  { url: '/Font/SF-Pro-Text/SF-Pro-Text-Medium.otf', family: 'SF Pro Text', weight: '500' },
  { url: '/Font/SF-Pro-Text/SF-Pro-Text-Semibold.otf', family: 'SF Pro Text', weight: '600' },
  { url: '/Font/SF-Pro-Text/SF-Pro-Text-Bold.otf', family: 'SF Pro Text', weight: '700' },
  { url: '/Font/LINESeedSans/LINESeedSans_Rg.otf', family: 'LINE Seed Sans', weight: '400' },
  { url: '/Font/LINESeedSans/LINESeedSans_Bd.otf', family: 'LINE Seed Sans', weight: '700' },
]

/**
 * Preload critical assets with high priority
 */
export function preloadCriticalAssets(baseUrl = '') {
  CRITICAL_ASSETS.forEach((src) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = baseUrl + src
    link.fetchPriority = 'high'
    document.head.appendChild(link)
  })
}

/**
 * Preload fonts with high priority
 */
export function preloadFonts(baseUrl = '') {
  FONTS.forEach(({ url, family, weight }) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/otf'
    link.href = baseUrl + url
    link.crossOrigin = 'anonymous'
    link.fetchPriority = 'high'
    document.head.appendChild(link)
  })
}

/**
 * Prefetch flow images in the background with low priority
 */
export function prefetchFlowImages(baseUrl = '') {
  // Use requestIdleCallback to avoid blocking main thread
  const prefetchBatch = (images) => {
    images.forEach((src) => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.as = 'image'
      link.href = baseUrl + src
      link.fetchPriority = 'low'
      document.head.appendChild(link)
    })
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => prefetchBatch(FLOW_IMAGES), { timeout: 2000 })
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => prefetchBatch(FLOW_IMAGES), 1000)
  }
}

/**
 * Progressive image loading using IntersectionObserver
 */
export function createLazyImageLoader() {
  if (!('IntersectionObserver' in window)) {
    return null
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          const src = img.dataset.src

          if (src) {
            img.src = src
            img.removeAttribute('data-src')
            observer.unobserve(img)
          }
        }
      })
    },
    {
      rootMargin: '50px',
      threshold: 0.01,
    }
  )

  return observer
}

/**
 * Initialize all asset preloading strategies
 */
export function initAssetPreloading(baseUrl = '') {
  // 1. Preload critical assets immediately
  preloadCriticalAssets(baseUrl)

  // 2. Preload fonts with high priority
  preloadFonts(baseUrl)

  // 3. Prefetch flow images in background after initial load
  if (document.readyState === 'complete') {
    prefetchFlowImages(baseUrl)
  } else {
    window.addEventListener('load', () => {
      prefetchFlowImages(baseUrl)
    })
  }
}
