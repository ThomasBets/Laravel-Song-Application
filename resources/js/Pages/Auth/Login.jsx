import AuthLayout from '@/Layouts/AuthLayout';

export default function Login() {
    return (
        <>
            <h1 className="text-5xl text-center font-bold">Login Form!</h1>
        </>
    );
}

Login.layout = page => <AuthLayout>{page}</AuthLayout>;
