import type { StepProps } from "../../types";
import Step5Notepad from "../../steps/Step5Notepad";

export default function NotepadPage({ data, setData }: StepProps) {
    return <div className="editor-legacy-remix"><Step5Notepad data={data} setData={setData} /></div>;
}
