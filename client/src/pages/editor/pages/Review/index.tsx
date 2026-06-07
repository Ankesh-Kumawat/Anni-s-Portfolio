import type { StepProps } from "../../types";
import Step7Review from "../../steps/Step7Review";

export default function ReviewPage({ data, setData }: StepProps) {
    return <div className="editor-legacy-remix"><Step7Review data={data} setData={setData} /></div>;
}
