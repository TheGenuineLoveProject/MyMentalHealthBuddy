import React from "react";
import "./LumiBrandAvatar.css";

export type LumiEmotion =
  | "calm"
  | "supportive"
  | "celebrate"
  | "reflect"
  | "guide"
  | "curious"
  | "listening";

export interface LumiBrandAvatarProps {
  emotion?: LumiEmotion;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  className?: string;
}

const sizeClass = {
  sm: "lumi-brand-avatar--sm",
  md: "lumi-brand-avatar--md",
  lg: "lumi-brand-avatar--lg",
  xl: "lumi-brand-avatar--xl",
};

const assetBase = "/avatar-core";

const layers = [
  {
    name: "shadow",
    className: "lumi-official-layer lumi-official-shadow",
    src: `${assetBase}/shadow/MMHB_FLOAT_IDLE_UNIT_v1_shadow.webp`,
    fallback: `${assetBase}/shadow/MMHB_FLOAT_IDLE_UNIT_v1_shadow.png`,
  },
  {
    name: "body",
    className: "lumi-official-layer lumi-official-body",
    src: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_body-residual.webp`,
    fallback: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_body-residual.png`,
  },
  {
    name: "torso",
    className: "lumi-official-layer lumi-official-torso",
    src: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_torso.webp`,
    fallback: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_torso.png`,
  },
  {
    name: "left arm",
    className: "lumi-official-layer lumi-official-arm-left",
    src: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_arm-l.webp`,
    fallback: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_arm-l.png`,
  },
  {
    name: "right arm",
    className: "lumi-official-layer lumi-official-arm-right",
    src: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_arm-r.webp`,
    fallback: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_arm-r.png`,
  },
  {
    name: "left leg",
    className: "lumi-official-layer lumi-official-leg-left",
    src: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_leg-l.webp`,
    fallback: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_leg-l.png`,
  },
  {
    name: "right leg",
    className: "lumi-official-layer lumi-official-leg-right",
    src: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_leg-r.webp`,
    fallback: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_leg-r.png`,
  },
  {
    name: "face",
    className: "lumi-official-layer lumi-official-face",
    src: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_face.webp`,
    fallback: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_face.png`,
  },
  {
    name: "eyes",
    className: "lumi-official-layer lumi-official-eyes",
    src: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_eyes.webp`,
    fallback: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_eyes.png`,
  },
  {
    name: "mouth",
    className: "lumi-official-layer lumi-official-mouth",
    src: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_mouth.webp`,
    fallback: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_mouth.png`,
  },
  {
    name: "top leaf",
    className: "lumi-official-layer lumi-official-top-leaf",
    src: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_top-leaf.webp`,
    fallback: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_top-leaf.png`,
  },
  {
    name: "sparkles",
    className: "lumi-official-layer lumi-official-sparkles",
    src: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_sparkles.webp`,
    fallback: `${assetBase}/regions/MMHB_FLOAT_IDLE_UNIT_v1_region_sparkles.png`,
  },
];

function OfficialLayer({
  src,
  fallback,
  className,
  name,
}: {
  src: string;
  fallback: string;
  className: string;
  name: string;
}) {
  return (
    <picture>
      <source srcSet={src} type="image/webp" />
      <img
        className={className}
        src={fallback}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        draggable={false}
        data-lumi-layer={name}
      />
    </picture>
  );
}

export default function LumiBrandAvatar({
  emotion = "supportive",
  size = "lg",
  label = "Lumi, your gentle wellness companion",
  className = "",
}: LumiBrandAvatarProps) {
  return (
    <figure
      className={`lumi-brand-avatar ${sizeClass[size]} lumi-brand-avatar--${emotion} ${className}`.trim()}
      aria-label={label}
      role="img"
      data-testid="lumi-brand-avatar"
      data-emotion={emotion}
      data-official-lumi="segmented-brand-rig"
    >
      <div className="lumi-brand-avatar__aura lumi-brand-avatar__aura-one" aria-hidden="true" />
      <div className="lumi-brand-avatar__aura lumi-brand-avatar__aura-two" aria-hidden="true" />
      <div className="lumi-brand-avatar__stage" aria-hidden="true">
        {layers.map((layer) => (
          <OfficialLayer key={layer.name} {...layer} />
        ))}
      </div>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
