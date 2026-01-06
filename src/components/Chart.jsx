import PrecureColorRing from "./PrecureColorRing";
import TransformationPlayer from "./TransformationPlayer";
import PrecureIcon from "./PrecureIcon";

export default function Chart() {
  return (
    <div className="relative w-[800px] h-[800px]">
      {/* リング（SVG） */}
      <PrecureColorRing />

      {/* アイコン */}
      {/* 配置は適当です */}
      <PrecureIcon />

      {/* 中央の YouTube */}
      <TransformationPlayer />
    </div>
  );
}
