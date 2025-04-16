export default function Register() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form className="flex flex-col gap-4 w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Name"
                    className="border border-gray-300 p-2 rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="border border-gray-300 p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border border-gray-300 p-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Register
                </button>
            </form>
            <p className="mt-4">
                Already have an account? <a href="/login" className="text-blue-500">Login</a>
            </p>
        </div>
    );
}