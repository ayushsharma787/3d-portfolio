"use client";

/**
 * Raymond logotype recreated in HTML/CSS.
 * Top: "The Complete Man" — serif tagline.
 * Middle: red block with white "raymond" wordmark (italicised serif).
 * Bottom: "SINCE 1925" — spaced uppercase in a thin frame.
 */
export default function RaymondMark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`raymond-mark ${className}`} aria-label="Raymond — The Complete Man — Since 1925">
      <div className="rm-tagline">The Complete Man</div>
      <div className="rm-block">
        <span className="rm-word">raymond</span>
      </div>
      <div className="rm-since">
        <span>S</span><span>I</span><span>N</span><span>C</span><span>E</span>
        <span className="rm-gap" />
        <span>1</span><span>9</span><span>2</span><span>5</span>
      </div>
    </div>
  );
}
