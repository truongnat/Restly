/**
 * RestlyLogo — brand mark dùng Material Symbol "api" (FILL 1) inline SVG.
 * Nền: bg-primary-container (#3f3bbd), icon trắng, rotate-12 → hover rotate-0.
 * Không phụ thuộc webfont; preferred cho desktop packaging sau này.
 */
export function RestlyLogo({ className }: { className?: string }) {
  return (
    <div
      className={`group flex size-24 rotate-12 items-center justify-center rounded-2xl bg-primary-container shadow-2xl transition-transform duration-500 hover:rotate-0 ${className ?? ''}`}
    >
      {/* Material Symbol "api" — FILL 1, path trích từ google/material-design-icons */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        className="size-12 fill-white transition-transform group-hover:scale-110"
        aria-label="API hub icon"
      >
        <path d="M240-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 43 5.5t38 15.5l74-74q-10-18-15.5-38T374-574q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 43T673-492l74 74q18-10 38-15.5t43-5.5q66 0 113 47t47 113q0 66-47 113t-113 47q-66 0-113-47t-47-113q0-23 5.5-43t15.5-38l-74-74q-18 10-38 15.5T534-420q-23 0-43-5.5T453-441l-74 74q10 18 15.5 38t5.5 43q0 66-47 113t-113 47Zm294-334q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29ZM240-200q33 0 56.5-23.5T320-280q0-33-23.5-56.5T240-360q-33 0-56.5 23.5T160-280q0 33 23.5 56.5T240-200Zm480 0q33 0 56.5-23.5T800-280q0-33-23.5-56.5T720-360q-33 0-56.5 23.5T640-280q0 33 23.5 56.5T720-200Z" />
      </svg>
    </div>
  )
}
