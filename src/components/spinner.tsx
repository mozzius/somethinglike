import {
  SpinnerCircularFixed,
  type SpinnerCircularFixedProps,
} from "spinners-react";
import { twMerge } from "tailwind-merge";

interface Props extends SpinnerCircularFixedProps {
  containerClassName?: string;
}

export const Spinner = ({ containerClassName, ...props }: Props) => (
  <div className={twMerge("relative h-full w-full", containerClassName)}>
    <SpinnerCircularFixed
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      color="#ffffff"
      secondaryColor="#ffffff69"
      {...props}
    />
  </div>
);
