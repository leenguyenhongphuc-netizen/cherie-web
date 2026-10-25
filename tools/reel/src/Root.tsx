import React from "react";
import { Composition } from "remotion";
import { Reel, durationOf, reelDefaults, ReelProps } from "./Reel";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="CherieReel"
    component={Reel as unknown as React.FC<Record<string, unknown>>}
    durationInFrames={durationOf(reelDefaults)}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={reelDefaults as unknown as Record<string, unknown>}
    calculateMetadata={({ props }) => ({ durationInFrames: durationOf(props as unknown as ReelProps) })}
  />
);
