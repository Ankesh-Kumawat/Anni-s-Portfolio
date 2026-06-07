import type { StepProps } from "../../types";
import Step6Advanced from "../../steps/Step6Advanced";

export default function AdvancedPage({ data, setData }: StepProps) {
    return <Step6Advanced data={data} setData={setData} />;
}
