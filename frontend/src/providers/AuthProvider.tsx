import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [loading, setLoading] = useState(true);
	const { checkAuth } = useAuthStore();

	useEffect(() => {
		setLoading(true);
		checkAuth().finally(() => {
			setLoading(false);
		});
	}, []);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-emerald-500 animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;
