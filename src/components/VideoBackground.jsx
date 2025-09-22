import { useEffect, useRef, useState } from 'react'

const VideoBackground = ({ 
  videoSrc, 
  children, 
  className = "", 
  overlay = true,
  overlayOpacity = 0.4 
}) => {
  const videoRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener('loadeddata', () => setIsLoaded(true))
      video.addEventListener('canplaythrough', () => setIsLoaded(true))
    }
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Fallback Background */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      )}

      {/* Overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-1000"
          style={{ opacity: isLoaded ? overlayOpacity : 0.8 }}
        ></div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}

export default VideoBackground
