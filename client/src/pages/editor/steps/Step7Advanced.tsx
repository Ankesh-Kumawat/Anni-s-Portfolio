import type { StepProps } from "../types";

export default function Step7Advanced({ data, setData }: StepProps) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Settings</h2>
                <p className="text-gray-600">Terminal, Database & Settings (Coming soon...)</p>
            </div>
            <div className="text-center py-12 text-gray-500">
                Advanced settings will be implemented next
            </div>
        </div>
    );
}
