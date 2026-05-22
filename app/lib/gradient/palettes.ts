/**
 * Card colour schemes.
 *
 * These keep the original well-calm colour scheme — the same hues the cards
 * shipped with — but described as a small structured palette the mesh
 * generator can work with, rather than as baked-in linear gradients.
 */

export type PresetName =
  | "calm"
  | "heart"
  | "bed"
  | "breathing"
  | "hrv"
  | "focusing";

export interface Palette {
  /** dominant, vivid hue — anchors the card's field colour */
  primary: string;
  /** secondary hue, used for the contrast blob */
  accent: string;
  /** warm signature highlight, kept from the original card design */
  glow: string;
}

export const PALETTES: Record<PresetName, Palette> = {
  calm: { primary: "#ff3fbf", accent: "#ffd042", glow: "#ffd042" },
  heart: { primary: "#f12203", accent: "#06e06c", glow: "#ffb143" },
  bed: { primary: "#182b63", accent: "#f09e2a", glow: "#ffb143" },
  breathing: { primary: "#0b65f7", accent: "#02c463", glow: "#ffb143" },
  hrv: { primary: "#7012b3", accent: "#f0522a", glow: "#ffb813" },
  focusing: { primary: "#163ad8", accent: "#aae612", glow: "#ffb143" },
};
