import type { StepProps } from "../../types";
import Step10Preferences from "../../steps/Step10Preferences";

export default function PreferencesPage({ data, setData }: StepProps) {
    return <Step10Preferences data={data} setData={setData} />;
}
