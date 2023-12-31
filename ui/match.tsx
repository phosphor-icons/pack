import {
  ReactNode,
  FunctionComponentElement,
  Children,
  ReactElement,
} from "react";

type MatchProps<T> = {
  value: T;
  children?:
    | ReactElement<MatchWhenProps<T>>
    | Iterable<ReactElement<MatchWhenProps<T>>>;
};

type MatchWhenProps<I> = {
  is: I;
  children: ReactNode;
};

type WhenProps = {
  is: boolean;
  children: ReactNode;
};

export const Match = <T,>(props: MatchProps<T>) => {
  const match = (
    Children.toArray(props.children) as FunctionComponentElement<
      MatchWhenProps<T>
    >[]
  ).find((when) => when.props.is === props.value);
  return <>{match ?? null}</>;
};

Match.When = <I,>(props: MatchWhenProps<I>) => {
  return <>{props.children ?? null}</>;
};

export const When = (props: WhenProps) => {
  return props.is ? props.children : null;
};
