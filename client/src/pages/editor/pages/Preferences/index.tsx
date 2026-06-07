import type { StepProps } from "../../types";
import Step10Preferences from "../../steps/Step10Preferences";

export default function PreferencesPage({ data, setData }: StepProps) {
    return <div className="editor-legacy-remix"><Step10Preferences data={data} setData={setData} /></div>;
}
