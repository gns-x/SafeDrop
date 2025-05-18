import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate } from '../services/auth.service';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { Shield, School, Loader2, ChevronRight, Lock, ArrowRight } from 'lucide-react';

export default function TeacherLoginPage() {
    const navigate = useNavigate();
    const { isAuthenticated, userRole, login } = useAuth();
    const [accessCode, setAccessCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && userRole) {
            navigate(`/${userRole.toLowerCase()}/dashboard`);
        }
    }, [isAuthenticated, userRole, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authenticate(accessCode, 'TEACHER');
            if (response.success && response.user) {
                login(response.user);
                navigate('/teacher/dashboard');
                toast.success('Welcome to SafeDrop!');
            } else {
                toast.error(response.error || 'Invalid access code');
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Section - Hero */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                <div className="relative z-10 p-12 flex flex-col justify-between h-full">
                    <div className="flex items-center space-x-3">
                        <Shield className="w-8 h-8 text-white" />
                        <span className="text-xl font-bold text-white">SafeDrop</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold leading-tight text-white">
                            Teacher Portal<br />
                            <span className="text-indigo-200">Made Simple</span>
                        </h1>
                        <p className="text-lg text-indigo-100 max-w-md">
                            Manage student pickups with ease. Safe, efficient, and hassle-free.
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            <School className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">Enterprise Security</p>
                            <p className="text-sm text-indigo-200">Your students' safety is our priority</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8 lg:hidden">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <Shield className="w-8 h-8 text-indigo-600" />
                            <span className="text-xl font-bold text-gray-800">SafeDrop</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Teacher Portal</h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                        <p className="text-gray-600 mb-8">Enter your access code to continue</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">
                                    Access Code
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                                    </div>
                                    <input
                                        id="accessCode"
                                        type="password"
                                        value={accessCode}
                                        onChange={(e) => setAccessCode(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
                                        placeholder="Enter your access code"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 px-4 font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => navigate('/')}
                                className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                            >
                                <School className="w-4 h-4" />
                                <span className="text-sm">Parent Access</span>
                            </button>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200">
                            <Shield className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm text-gray-600">Enterprise-Grade Security</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}