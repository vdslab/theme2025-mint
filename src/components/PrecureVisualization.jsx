import { useState, useEffect } from "react";

import Chart from "./Chart";
import PrecureColorRing from "./PrecureColorRing";
import PrecureBarChart from "./PrecureBarChart";
import TransformationPlayer from "./TransformationPlayer";
import PrecureIcon from "./PrecureIcon";
import { PERSONALITY_METRICS } from "../constants/personality_metrics";

export default function PrecureVisualization() {
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
        {/* <PrecureBarChart data={data} metric={metric} /> */}
      </div>

      <div className="relative w-[800px] h-[800px]">
        {/* カラーリング */}
        {/* <PrecureColorRing /> */}

        {/* アイコン */}
        <PrecureIcon />

        {/* 中央の YouTube */}
        <TransformationPlayer />

        {/* チャート */}
        <Chart data={data} metric={metric} />
      </div>
    </>
  );
}
