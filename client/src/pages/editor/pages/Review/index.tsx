import type { StepProps } from "../../types";
import Step7Review from "../../steps/Step7Review";

export default function ReviewPage({ data, setData }: StepProps) {
    return <Step7Review data={data} setData={setData} />;
}
