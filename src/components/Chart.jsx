import { useState,useEffect } from "react";

import PrecureColorRing from "./PrecureColorRing";
import TransformationPlayer from "./TransformationPlayer";
import PrecureIcon from "./PrecureIcon";
import PrecureAxisBarChart from "./PrecureAxisBarChart";
import { PERSONALITY_METRICS } from "../constants/personality_metrics";

export default function Chart() {
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState(PERSONALITY_METRICS[0]);

  useEffect(() => {
    fetch("/data/precure_sorted.json")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data.length) {
    return <div className="p-6">loading...</div>;
  }
  
  return (
    <>
      <div className="relative w-[800px] h-[800px]">
        {/* リング（SVG） */}
        <PrecureColorRing />

        {/* アイコン */}
        {/* 配置は適当です */}
        <PrecureIcon />

        {/* 中央の YouTube */}
        <TransformationPlayer />
      </div>

      {/* 棒グラフ */}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {PERSONALITY_METRICS.map((m) => (
            <button
              key={m}
              className={`btn btn-sm ${
                metric === m ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setMetric(m)}
            >
              {m}
            </button>
          ))}
        </div>

        <PrecureAxisBarChart data={data} metric={metric} />
      </div>
    </>
  );
}
