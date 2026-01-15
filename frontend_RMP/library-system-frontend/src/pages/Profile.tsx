import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export function Profile() {
  const user = useAppSelector((state) => state.auth.user);

  const { data: loans } = useQuery({
    queryKey: ["user-loans"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/me/loans/", {
        credentials: "include",
      });
      return response.json();
    },
  });

  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      oldPassword: "",
      newPassword: "",
    },
  });

  const updateProfile = async (data: any) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/profile/update/`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        toast({ title: "Profile Updated!" });
      }
    } catch (error) {
      toast({ title: "Update Failed", variant: "destructive" });
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user?.username}</h1>
          <p className="text-muted-foreground">Library Member</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 p-6 border rounded-lg">
          <h3 className="font-semibold text-lg">Account Info</h3>
          <div className="space-y-1 text-sm">
            <div>
              <strong>Member ID:</strong> #{user?.id || "N/A"}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 p-6 border rounded-lg">
          <h3 className="font-semibold text-lg">Current Loans</h3>
          <div className="text-sm text-muted-foreground">0 active loans</div>
          <Button variant="outline" className="w-full">
            View My Loans
          </Button>
        </div>
      </div>

      <div className="space-y-2 p-6 border rounded-lg">
        <h3 className="font-semibold text-lg">Loan Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center p-4 bg-muted rounded-lg">
          <div>
            <div className="text-2xl font-bold text-primary">
              {loans?.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Active Loans</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-xs text-muted-foreground">On Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-destructive">0</div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="space-y-4 p-8 border rounded-xl">
          <h2 className="text-2xl font-bold">Edit Profile</h2>

          <form
            onSubmit={form.handleSubmit(updateProfile)}
            className="grid gap-4 md:grid-cols-2"
          >
            <Input placeholder="Username" {...form.register("username")} />
            <Input
              type="email"
              placeholder="Email"
              {...form.register("email")}
            />
            <Button type="submit" className="md:col-span-2">
              Update Profile
            </Button>
          </form>
        </div>

        {/* Password Change */}
        <div className="space-y-4 p-8 border rounded-xl">
          <h2 className="text-2xl font-bold">Change Password</h2>
          <form className="grid gap-4">
            <Input
              type="password"
              placeholder="Old Password"
              {...form.register("oldPassword")}
            />
            <Input
              type="password"
              placeholder="New Password"
              {...form.register("newPassword")}
            />
            <Button type="submit" className="w-full">
              Change Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
