import { useEffect, useRef, useState } from "react";

export default function LazyImage({ src, alt, className }) {
  const imgRef = useRef(null);
  const [loadedSrc, setLoadedSrc] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // ketika gambar terlihat → baru load src
            setLoadedSrc(src);
            observer.unobserve(entry.target); // stop observing setelah load
          }
        });
      },
      {
        rootMargin: "150px", // load 150px sebelum masuk viewport
      }
    );

    if (imgRef.current) observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={loadedSrc}
      alt={alt}
      className={className}
      loading="lazy" // fallback
    />
  );
}
