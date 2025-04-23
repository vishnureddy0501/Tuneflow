import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, CircleUserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const { UserSignup, isLoading: isLoggingIn } = useAuthStore();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "vishnureddy8980@gmail.com",
        password: "Vishnu@8980",
        firstName: "Vishnu",
        lastName: "Vardhan",
        username: "vishnureddy8980"
    });

    const validateForm = () => {
        if (!formData.firstName.trim()) return toast.error("First Name is required");
        if (!formData.lastName.trim()) return toast.error("Last Name is required");
        if (!formData.username.trim()) return toast.error("Username is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.password) return toast.error("Password is required");
        return true;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await UserSignup(formData);
                navigate("/");
            } catch (error: any) {
                toast.error(error.message || "Signup failed. Please try again.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Create an Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium">First Name</label>
                                <div className="relative mt-1">
                                    <CircleUserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <Input
                                        type="text"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="pl-10 w-full"
                                    />
                                </div>
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium">Last Name</label>
                                <div className="relative mt-1">
                                    <CircleUserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <Input
                                        type="text"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="pl-10 w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Username</label>
                            <div className="relative mt-1">
                                <CircleUserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <Input
                                    type="text"
                                    placeholder="johndoe8980"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} className="text-gray-400" />
                                    ) : (
                                        <Eye size={20} className="text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoggingIn}>
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} /> Signing Up...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                    <p className="mt-4 text-center text-sm">
                        Already have an account? <Link to="/auth/login" className="text-blue-600 hover:underline">Login</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Signup;