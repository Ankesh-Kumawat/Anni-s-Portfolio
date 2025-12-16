import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Lock, Shield } from "lucide-react";

export function AccountSettings() {
    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Account</h2>
                <p className="text-muted-foreground">Manage your profile and security.</p>
            </div>
            <div className="p-6 rounded-xl border bg-card flex items-center gap-6">
                <Avatar className="w-20 h-20">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold">John Doe</h3>
                    <p className="text-sm text-muted-foreground">Administrator</p>
                    <Button variant="outline" size="sm" className="mt-2">Edit Profile</Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-card space-y-2">
                    <Lock className="w-5 h-5 text-blue-500" />
                    <h4 className="font-medium">Sign-in & Security</h4>
                    <p className="text-xs text-muted-foreground">Password, 2FA, Recovery</p>
                </div>
                <div className="p-4 rounded-xl border bg-card space-y-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <h4 className="font-medium">Privacy</h4>
                    <p className="text-xs text-muted-foreground">Data controls, Permissions</p>
                </div>
            </div>
        </>
    );
}
