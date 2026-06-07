import type { StepProps } from "../../types";
import Step9YouTube from "../../steps/Step9YouTube";

export default function YouTubePage({ data, setData }: StepProps) {
    return <Step9YouTube data={data} setData={setData} />;
}
