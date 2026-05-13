import { Metadata } from "next";
import { ProfileSettings } from "@/components/profile/profile-settings";

export const metadata: Metadata = {
  title: "Profile - JobLens AI",
  description: "Manage your profile and preferences",
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <ProfileSettings />
    </div>
  );
}
