import { createElement, forwardRef } from "react";

import type { IconAttrs, IconComponent, IconNode, IconProps } from "../types";

type CreateIconOptions = {
  defaultStroke?: "currentColor" | "none";
  defaultStrokeWidth?: number;
  defaultSecondaryOpacity?: number;
  useRoundedStrokes?: boolean;
  viewBox?: string;
};

const SVG_DEFAULTS = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
} as const;

function getAriaHidden(props: IconProps): boolean | undefined {
  if (props.title || props["aria-label"] || props["aria-labelledby"]) {
    return undefined;
  }

  return true;
}

function renderNode(
  node: readonly [tagName: string, attrs: IconAttrs],
  strokeWidth: number | undefined,
  secondaryColor: string | undefined,
  secondaryOpacity: number | undefined
) {
  const [tag, rawAttrs] = node;
  const attrs: IconAttrs = { ...rawAttrs };

  const isSecondaryLayer =
    rawAttrs.opacity !== undefined || rawAttrs.fillOpacity !== undefined;
  if (secondaryColor && isSecondaryLayer) {
    if (rawAttrs.stroke !== undefined) {
      attrs.stroke = secondaryColor;
    }
    if (rawAttrs.fill !== undefined) {
      attrs.fill = secondaryColor;
    }
  }

  if (secondaryOpacity !== undefined && isSecondaryLayer) {
    if (rawAttrs.fillOpacity === undefined) {
      attrs.opacity = secondaryOpacity;
    } else {
      attrs.fillOpacity = secondaryOpacity;
    }
  }

  if (strokeWidth !== undefined && rawAttrs.stroke !== undefined) {
    attrs.strokeWidth = strokeWidth;
  }

  return createElement(tag, {
    ...attrs,
    key: rawAttrs.key,
  });
}

function buildIcon(
  displayName: string,
  iconNode: IconNode,
  options: CreateIconOptions
): IconComponent {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
    {
      size = 24,
      strokeWidth = options.defaultStrokeWidth,
      title,
      secondaryColor,
      secondaryOpacity = options.defaultSecondaryOpacity,
      children,
      ...rest
    },
    ref
  ) {
    const ariaHidden = getAriaHidden({ title, ...rest });

    return createElement(
      "svg",
      {
        ref,
        ...SVG_DEFAULTS,
        viewBox: options.viewBox ?? SVG_DEFAULTS.viewBox,
        width: size,
        height: size,
        stroke: options.defaultStroke ?? "currentColor",
        strokeWidth,
        strokeLinecap: options.useRoundedStrokes ? "round" : undefined,
        strokeLinejoin: options.useRoundedStrokes ? "round" : undefined,
        "aria-hidden": ariaHidden,
        ...rest,
      },
      title ? createElement("title", null, title) : null,
      ...iconNode.map((node) =>
        renderNode(node, strokeWidth, secondaryColor, secondaryOpacity)
      ),
      children
    );
  });

  Icon.displayName = displayName;
  return Icon;
}

export function createLucideIcon(
  displayName: string,
  iconNode: IconNode,
  options: Pick<CreateIconOptions, "viewBox"> = {}
): IconComponent {
  return buildIcon(displayName, iconNode, {
    defaultStrokeWidth: 2,
    useRoundedStrokes: true,
    viewBox: options.viewBox,
  });
}

export function createDuotoneIcon(
  displayName: string,
  iconNode: IconNode,
  options: Pick<CreateIconOptions, "defaultSecondaryOpacity" | "viewBox"> = {}
): IconComponent {
  return buildIcon(displayName, iconNode, {
    defaultStrokeWidth: undefined,
    useRoundedStrokes: false,
    defaultSecondaryOpacity: options.defaultSecondaryOpacity ?? 0.08,
    viewBox: options.viewBox,
  });
}

export function createStrokeIcon(
  displayName: string,
  iconNode: IconNode,
  options: Pick<CreateIconOptions, "viewBox"> = {}
): IconComponent {
  return buildIcon(displayName, iconNode, {
    defaultStrokeWidth: undefined,
    useRoundedStrokes: false,
    viewBox: options.viewBox,
  });
}

export function createSolidIcon(
  displayName: string,
  iconNode: IconNode,
  options: Pick<CreateIconOptions, "viewBox"> = {}
): IconComponent {
  return buildIcon(displayName, iconNode, {
    defaultStroke: "none",
    defaultStrokeWidth: undefined,
    useRoundedStrokes: false,
    viewBox: options.viewBox,
  });
}
