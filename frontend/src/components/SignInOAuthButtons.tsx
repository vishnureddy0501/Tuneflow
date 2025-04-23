import { Button } from "./ui/button";
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

const SignInOAuthButtons = () => {
	const { userDetails, Logout, googleSignIN } = useAuthStore();
	const navigate = useNavigate();

	const signInWithGoogle = () => {
		console.log("handle signin with google");
		googleSignIN();
	};
	const handleLogin = () => {
		if (userDetails) {
			Logout();
			navigate("/");
		} else {
			navigate("/auth/login");
		}
	}

	return (
		<>
			<Button onClick={signInWithGoogle} variant={"secondary"} className='w-full text-white border-zinc-200 h-11'>
				<img src='/google.png' alt='Google' className='size-5' />
				Continue with Google
			</Button>
			<Button onClick={handleLogin} variant={"secondary"} className='w-full text-white border-zinc-200 h-11'>
				{userDetails ? "Logout" : "Login"}
			</Button>
		</>
	);
};
export default SignInOAuthButtons;
