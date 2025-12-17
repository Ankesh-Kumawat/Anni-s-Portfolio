import type { StepProps } from "../types";

export default function Step6Notepad({ data, setData }: StepProps) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Notepad</h2>
                <p className="text-gray-600">Add default notes (Coming soon...)</p>
            </div>
            <div className="text-center py-12 text-gray-500">
                Notepad editor will be implemented next
            </div>
        </div>
    );
}
