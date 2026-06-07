import type { StepProps } from "../../types";
import Step11Apps from "../../steps/Step11Apps";

export default function AppsPage({ data, setData }: StepProps) {
    return <div className="editor-legacy-remix"><Step11Apps data={data} setData={setData} /></div>;
}
