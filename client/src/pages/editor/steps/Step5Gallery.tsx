import type { StepProps } from "../types";

export default function Step5Gallery({ data, setData }: StepProps) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gallery</h2>
                <p className="text-gray-600">Organize your images (Coming soon...)</p>
            </div>
            <div className="text-center py-12 text-gray-500">
                Gallery editor will be implemented next
            </div>
        </div>
    );
}
