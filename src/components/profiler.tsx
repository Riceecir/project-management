import React, {
  Profiler,
  ProfilerProps,
  ProfilerOnRenderCallback,
} from "react";

type Props = { metadata?: any; phases?: ("mount" | "update")[] } & Omit<
  ProfilerProps,
  "onRender"
>;

let queue: unknown[] = [];

const sendProfileQueue = () => {
  if (!queue.length) return;

  const queueToSend = [...queue];
  queue = [];
  console.log(queueToSend);
};
/* 每5秒输出到控制台一次 */
setInterval(sendProfileQueue, 5000);

export default function Profilter({ metadata, phases, ...props }: Props) {
  const reportProfile: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    if (!phases || phases.includes(phase)) {
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      });
    }
  };

  return <Profiler onRender={reportProfile} {...props} />;
}
