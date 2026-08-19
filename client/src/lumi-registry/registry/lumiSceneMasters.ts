import type { LumiVariantId } from "./officialLumiRegistry";

export interface LumiSceneMaster {
  readonly variant: LumiVariantId;
  readonly pngSrc: string;
  readonly webpSrc: string;
  readonly width: number;
  readonly height: number;
  readonly objectPosition: string;
  readonly decorative: true;
  readonly provenanceSource: string;
}

export const LUMI_SCENE_MASTERS: Readonly<
  Partial<Record<LumiVariantId, LumiSceneMaster>>
> = Object.freeze({
  LUMI_FLOAT_IDLE: Object.freeze({
    variant: "LUMI_FLOAT_IDLE",
    pngSrc: "/lumi/scenes/lumi-float-idle-scene.png",
    webpSrc: "/lumi/scenes/lumi-float-idle-scene.webp",
    width: 512,
    height: 512,
    objectPosition: "50% 50%",
    decorative: true,
    provenanceSource: "IMG_4345_1778823252522.png",
  }),
  LUMI_HEART: Object.freeze({
    variant: "LUMI_HEART",
    pngSrc: "/lumi/scenes/lumi-heart-scene.png",
    webpSrc: "/lumi/scenes/lumi-heart-scene.webp",
    width: 512,
    height: 512,
    objectPosition: "50% 50%",
    decorative: true,
    provenanceSource: "IMG_4346_1778823252522.png",
  }),
  LUMI_MEDITATION: Object.freeze({
    variant: "LUMI_MEDITATION",
    pngSrc: "/lumi/scenes/lumi-meditation-scene.png",
    webpSrc: "/lumi/scenes/lumi-meditation-scene.webp",
    width: 512,
    height: 512,
    objectPosition: "50% 50%",
    decorative: true,
    provenanceSource: "IMG_4347_1778823252522.png",
  }),
  LUMI_COMPANION: Object.freeze({
    variant: "LUMI_COMPANION",
    pngSrc: "/lumi/scenes/lumi-companion-scene.png",
    webpSrc: "/lumi/scenes/lumi-companion-scene.webp",
    width: 1024,
    height: 576,
    objectPosition: "50% 50%",
    decorative: true,
    provenanceSource: "IMG_4348_1778823252522.png",
  }),
  LUMI_PATH: Object.freeze({
    variant: "LUMI_PATH",
    pngSrc: "/lumi/scenes/lumi-path-scene.png",
    webpSrc: "/lumi/scenes/lumi-path-scene.webp",
    width: 1024,
    height: 576,
    objectPosition: "50% 50%",
    decorative: true,
    provenanceSource: "IMG_4349_1778823252522.png",
  }),
  LUMI_EMOTION_ORB: Object.freeze({
    variant: "LUMI_EMOTION_ORB",
    pngSrc: "/lumi/scenes/lumi-emotion-orb-scene.png",
    webpSrc: "/lumi/scenes/lumi-emotion-orb-scene.webp",
    width: 1024,
    height: 576,
    objectPosition: "50% 50%",
    decorative: true,
    provenanceSource: "IMG_4350_1778823252522.png",
  }),
  LUMI_SOFT_PRESENCE: Object.freeze({
    variant: "LUMI_SOFT_PRESENCE",
    pngSrc: "/lumi/scenes/lumi-soft-presence-scene.png",
    webpSrc: "/lumi/scenes/lumi-soft-presence-scene.webp",
    width: 1024,
    height: 576,
    objectPosition: "50% 50%",
    decorative: true,
    provenanceSource: "IMG_4351_1778823252522.png",
  }),
});

export function getLumiSceneMaster(
  variant: LumiVariantId,
): LumiSceneMaster | undefined {
  return LUMI_SCENE_MASTERS[variant];
}

export function hasLumiSceneMaster(
  variant: LumiVariantId,
): boolean {
  return getLumiSceneMaster(variant) !== undefined;
}
