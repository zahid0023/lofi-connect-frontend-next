"use client";

import { useEffect, useState } from "react";
import { KeyRound, Loader2, Settings, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getMe, changePassword, type UserProfile } from "@/services/user";

export default function SettingsPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);

    // Change password form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    useEffect(() => {
        getMe()
            .then(setProfile)
            .catch(() => toast.error("Failed to load profile"))
            .finally(() => setProfileLoading(false));
    }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters.");
            return;
        }

        setPasswordLoading(true);
        try {
            await changePassword({
                current_password: currentPassword,
                new_password: newPassword,
                confirm_new_password: confirmPassword,
            });
            toast.success("Password updated successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to change password.";
            setPasswordError(message);
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="h-6 w-6 text-primary" />
                    Settings
                </h1>
                <p className="text-muted-foreground">
                    Manage your account details and security preferences.
                </p>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile
                    </CardTitle>
                    <CardDescription>Your account information.</CardDescription>
                </CardHeader>
                <CardContent>
                    {profileLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Loading profile…</span>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={profile?.user_name ?? ""}
                                readOnly
                                className="bg-muted cursor-default"
                            />
                            <p className="text-xs text-muted-foreground">
                                Your username cannot be changed.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Separator />

            {/* Change Password Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5" />
                        Change Password
                    </CardTitle>
                    <CardDescription>
                        Update your password to keep your account secure.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input
                                id="current-password"
                                type="password"
                                autoComplete="current-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {passwordError && (
                            <p className="text-sm text-destructive">{passwordError}</p>
                        )}

                        <Button type="submit" disabled={passwordLoading}>
                            {passwordLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Update Password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
