import type { StepProps } from "../../types";
import Step8Music from "../../steps/Step8Music";

export default function MusicPage({ data, setData }: StepProps) {
    return <Step8Music data={data} setData={setData} />;
}
