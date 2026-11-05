import type * as React from "react";

export type IconProps = Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
  size?: number | string;
  strokeWidth?: number;
  title?: string;
  secondaryColor?: string;
  secondaryOpacity?: number;
};

export type IconComponent = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>;

export type IconNode = ReadonlyArray<
  readonly [tagName: keyof React.JSX.IntrinsicElements, attrs: IconAttrs]
>;

export type IconAttrs = {
  [key: string]: string | number | boolean | undefined;
  key?: string;
  opacity?: string | number;
  stroke?: string;
  fill?: string;
  fillOpacity?: string | number;
  strokeWidth?: string | number;
};
