import type { StepProps } from "../types";

export default function Step8Review({ data, setData }: StepProps) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Download</h2>
                <p className="text-gray-600">Review your data and download the ZIP file</p>
            </div>

            <div className="space-y-6">
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Personal Info</h3>
                    <p className="text-sm text-gray-600">Name: {data.about.personal.name || "Not set"}</p>
                    <p className="text-sm text-gray-600">Title: {data.about.personal.title || "Not set"}</p>
                    <p className="text-sm text-gray-600">Skills: {data.about.skills.length} added</p>
                    <p className="text-sm text-gray-600">Experience: {data.about.experience.length} entries</p>
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Contact</h3>
                    <p className="text-sm text-gray-600">Email: {data.contact.email || "Not set"}</p>
                    <p className="text-sm text-gray-600">Location: {data.contact.location || "Not set"}</p>
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Social Links</h3>
                    <p className="text-sm text-gray-600">{data.social.links.length} links added</p>
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Assets</h3>
                    <p className="text-sm text-gray-600">Images: {data.assets.images.length}</p>
                    <p className="text-sm text-gray-600">Music: {data.assets.music.length}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                        Click the "Download ZIP" button in the header to generate and download your portfolio data package.
                    </p>
                </div>
            </div>
        </div>
    );
}
