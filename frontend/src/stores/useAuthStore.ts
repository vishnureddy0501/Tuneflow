import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import toast from "react-hot-toast";

interface signupData {
	isAdmin: boolean;
	email: string;
}
interface LoginData {
	email: string;
	password: string;
}
interface AuthStore {
	isAdmin: boolean;
	isLoading: boolean;
	error: string | null;
	userDetails: null | authResponse;
	checkAdminStatus: () => Promise<void>;
	LoginCheck: (data: LoginData) => Promise<void | null>;
	reset: () => void;
	checkAuth: () => void;
	Logout: () => void;
	UserSignup: (data: signupData) => Promise<void | null>;
}

interface authResponse {
	createdAt?: string;
	email?: string;
	fullName?: string;
	updatedAt?: string;
	_id?: string;
	data: any;
	message: string
}

export const useAuthStore = create<AuthStore>((set) => ({
	isAdmin: false,
	isLoading: false,
	error: null,
	userDetails: null,

	checkAdminStatus: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/admin/check");
			set({ isAdmin: response.data.admin });
		} catch (error: any) {
			set({ isAdmin: false, error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	reset: () => {
		set({ isAdmin: false, isLoading: false, error: null });
	},
	LoginCheck: async (data: LoginData) => {
		set({ isLoading: true });
		try {
			const response = await axiosInstance.post("/auth/login", data);
			set({ userDetails: response.data });;
		} catch (error) {
			console.log("🚨 Error in LoginCheckClient:", error);
			return null;
		} finally {
			set({ isLoading: false });
		}
	},
	UserSignup: async (data: signupData) => {
		try {
			set({ isLoading: true });
			const response: authResponse = await axiosInstance.post("/auth/signup", data);
			if (response.message) {
				toast.error(response.message);
			}  else {
				toast.success("Account created successfully");
				set({ userDetails: response.data });
			}
		} catch (error) {
			console.log("🚨 Error in SignupCheckClient:", error);
			return null;
		} finally {
			set({ isLoading: false });
		}
	},
	checkAuth: async () => {
		try {
			set({ isLoading: true });
			const response: authResponse = await axiosInstance.get("/auth/check");
			if (response.message) {
				toast.error(response.message);
			}  else {
				set({ userDetails: response.data });	
			}
		} catch (error) {
			console.log("🚨 Error in AuthenticationCheck:", error);
			return null;
		} finally {
			set({ isLoading: false });
		}
	},
	Logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ userDetails: null});
			toast.success("User Logged out successfully");
		} catch (error) {
			console.log("🚨 Error in LogoutCheck:", error);
			return null;
		}
	},
	googleSignIN: async () => {
		try {
			window.location.href = "http://localhost:5000/api/auth/google";
		} catch (error) {
			console.log("🚨 Error in googleSignin:", error);
			return null;
		}
	}
}));
