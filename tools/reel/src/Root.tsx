import React from "react";
import { Composition, Still } from "remotion";
import { KvPost, KvStory, KvCover, kvDefaults } from "./KeyVisual";
import { Reel, durationOf, reelDefaults, ReelProps } from "./Reel";
import { Reel2, duration2, reel2Defaults, Reel2Props } from "./Reel2";

export const RemotionRoot: React.FC = () => (
  <>
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
    <Composition
      id="CherieReel2"
      component={Reel2 as unknown as React.FC<Record<string, unknown>>}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={reel2Defaults as unknown as Record<string, unknown>}
      calculateMetadata={({ props }) => ({ durationInFrames: duration2(props as unknown as Reel2Props) })}
    />
    <Still id="KvPost" component={KvPost as unknown as React.FC<Record<string, unknown>>} width={1080} height={1350} defaultProps={kvDefaults as unknown as Record<string, unknown>} />
    <Still id="KvStory" component={KvStory as unknown as React.FC<Record<string, unknown>>} width={1080} height={1920} defaultProps={kvDefaults as unknown as Record<string, unknown>} />
    <Still id="KvCover" component={KvCover as unknown as React.FC<Record<string, unknown>>} width={1080} height={1920} defaultProps={kvDefaults as unknown as Record<string, unknown>} />
  </>
);
