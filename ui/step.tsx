import { ReactNode } from "react";
import * as styles from "#/styles/step.css";

export type StepItem = {
  title: string;
  actions?: ReactNode;
  chilren: ReactNode;
};

type StepProps = StepItem & {
  index: number;
};

type StepsProps = {
  steps: StepItem[];
};

const NUMBER_MAP = {
  0: "zero",
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
};

function stepNumberClass(index: number) {
  const prefix = "ph-fill";
  const numberName = NUMBER_MAP[((index + 1) % 10) as keyof typeof NUMBER_MAP];
  return `${prefix} ph-number-circle-${numberName}`;
}

export const Step = (props: StepProps) => {
  return (
    <li className={styles.step}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTitle}>
          <i
            className={`${styles.stepNumber} ${stepNumberClass(props.index)}`}
          ></i>
          <h2 className={styles.stepName}>{props.title}</h2>
        </div>
        {props.actions}
      </div>
      {props.chilren}
    </li>
  );
};

export const Steps = (props: StepsProps) => {
  return (
    <ol className={styles.steps}>
      {props.steps.map((step, i) => (
        <Step key={step.title} index={i} {...step} />
      ))}
    </ol>
  );
};
