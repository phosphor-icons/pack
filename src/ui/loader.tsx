import * as styles from "@/styles/loader.css";

export const Loader = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={styles.loader}
      viewBox="0 0 256 256"
    >
      <circle
        cx="128"
        cy="136"
        r="88"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="128"
        y1="136"
        x2="168"
        y2="96"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 128 136"
          to="360 128 136"
          dur="1s"
          repeatCount="indefinite"
        />
      </line>
      <line
        x1="104"
        y1="16"
        x2="152"
        y2="16"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      >
        <animate
          attributeName="y1"
          from="16"
          to="30"
          begin="0s"
          dur="1s"
          values="16;16;30;16"
          keyTimes="
			0;0.7;0.8;1"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y2"
          from="16"
          to="30"
          begin="0s"
          dur="1s"
          values="16;16;30;16"
          keyTimes="
			0;0.7;0.8;1"
          repeatCount="indefinite"
        />
      </line>
    </svg>
  );
};
