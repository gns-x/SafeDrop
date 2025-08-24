import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  GraduationCap, 
  Users, 
  Lock, 
  Eye, 
  EyeOff, 
  Mail, 
  Key,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { authenticate, authenticateAdmin } from '../services/auth.service';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

type LoginRole = 'TEACHER' | 'PARENT' | 'ADMIN';
type LoginMethod = 'accessCode' | 'emailPassword';

interface LoginFormData {
  accessCode: string;
  email: string;
  password: string;
}

const roleConfig = {
  TEACHER: {
    title: 'Teacher Portal',
    subtitle: 'Manage student pickups with ease',
    icon: GraduationCap,
    color: 'from-blue-600 to-indigo-700',
    accentColor: 'blue',
    description: 'Access your classroom dashboard and monitor student status in real-time.',
    features: ['Real-time student tracking', 'Pickup management', 'Class overview']
  },
  PARENT: {
    title: 'Parent Portal',
    subtitle: 'Stay connected with your child',
    icon: Users,
    color: 'from-green-600 to-emerald-700',
    accentColor: 'green',
    description: 'Track your child\'s pickup status and receive instant notifications.',
    features: ['Live pickup status', 'Instant notifications', 'Child safety tracking']
  },
  ADMIN: {
    title: 'Admin Portal',
    subtitle: 'System administration & oversight',
    icon: Lock,
    color: 'from-purple-600 to-violet-700',
    accentColor: 'purple',
    description: 'Manage users, monitor system health, and oversee all operations.',
    features: ['User management', 'System monitoring', 'Analytics dashboard']
  }
};

export default function UnifiedLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<LoginRole>('TEACHER');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('accessCode');
  const [formData, setFormData] = useState<LoginFormData>({
    accessCode: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-switch login method based on role
  useEffect(() => {
    setLoginMethod(selectedRole === 'ADMIN' ? 'emailPassword' : 'accessCode');
    setFormData({ accessCode: '', email: '', password: '' });
    setErrors({});
  }, [selectedRole]);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (loginMethod === 'accessCode') {
      if (!formData.accessCode.trim()) {
        newErrors.accessCode = 'Access code is required';
      } else if (formData.accessCode.length < 6) {
        newErrors.accessCode = 'Access code must be at least 6 characters';
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      let response;
      
      if (loginMethod === 'accessCode') {
        response = await authenticate(formData.accessCode, selectedRole);
      } else {
        // Admin login with email/password
        response = await authenticateAdmin(formData.email, formData.password);
      }

      if (response.success && response.user) {
        setIsSuccess(true);
        
        // Show success animation
        setTimeout(() => {
          login(response.user);
          
          // Navigate based on role
          switch (selectedRole) {
            case 'TEACHER':
              navigate('/teacher/dashboard');
              break;
            case 'PARENT':
              navigate('/parent/dashboard');
              break;
            case 'ADMIN':
              navigate('/admin/dashboard');
              break;
          }
          
          toast.success(`Welcome to ${roleConfig[selectedRole].title}!`);
        }, 1000);
      } else {
        toast.error(response.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRedirectPath = (role: LoginRole) => {
    switch (role) {
      case 'TEACHER': return '/teacher/dashboard';
      case 'PARENT': return '/parent/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex relative">
      {/* Success Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-gray-800"
              >
                Welcome Back!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-base text-gray-600"
              >
                Redirecting to your dashboard...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Left Section - Dynamic Hero */}
      <motion.div 
        className="hidden lg:flex w-1/2 relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${roleConfig[selectedRole].color} transition-all duration-700`} />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
        
        <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white">
          {/* Header */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-2xl font-bold">SafeDrop</span>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-6">
              <motion.div
                key={selectedRole}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl font-bold leading-tight mb-4">
                  {roleConfig[selectedRole].title}
                </h1>
                <p className="text-xl opacity-90">
                  {roleConfig[selectedRole].subtitle}
                </p>
              </motion.div>
              
              <p className="text-lg opacity-80 max-w-md leading-relaxed">
                {roleConfig[selectedRole].description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {roleConfig[selectedRole].features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="opacity-90">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="flex items-center justify-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="w-2 h-2 bg-white/30 rounded-full"></div>
            <p className="font-medium text-white/90">Enterprise Security</p>
            <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Section - Login Form */}
      <motion.div 
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="text-center mb-8 lg:hidden">
            <motion.div 
              className="flex items-center justify-center space-x-3 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-xl font-bold text-gray-800">SafeDrop</span>
            </motion.div>
            <motion.h2 
              className="text-2xl font-bold text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {roleConfig[selectedRole].title}
            </motion.h2>
          </div>

          {/* Role Selector */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Your Role</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['TEACHER', 'PARENT', 'ADMIN'] as LoginRole[]).map((role) => (
                <motion.button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    selectedRole === role
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center space-y-2">
                    <div className={`mx-auto p-2 rounded-md ${
                      selectedRole === role 
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {React.createElement(roleConfig[role].icon, { className: "w-4 h-4" })}
                    </div>
                    <span className={`text-xs font-medium ${
                      selectedRole === role 
                        ? 'text-blue-700'
                        : 'text-gray-600'
                    }`}>
                      {role.charAt(0) + role.slice(1).toLowerCase()}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">
                {loginMethod === 'accessCode' 
                  ? 'Enter your access code to continue'
                  : 'Enter your credentials to continue'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Access Code Input */}
              <AnimatePresence mode="wait">
                {loginMethod === 'accessCode' && (
                  <motion.div
                    key="accessCode"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">
                      Access Code
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                      </div>
                                             <input
                         id="accessCode"
                         type="text"
                         value={formData.accessCode}
                         onChange={(e) => handleInputChange('accessCode', e.target.value)}
                         className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-2 transition-all duration-300 ${
                           errors.accessCode 
                             ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                             : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                         } focus:ring-2 focus:outline-none focus:bg-white hover:bg-white`}
                         placeholder="Enter your access code"
                         disabled={isLoading}
                         required
                       />
                      {errors.accessCode && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -bottom-6 left-0 text-sm text-red-600 flex items-center space-x-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.accessCode}</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Input */}
              <AnimatePresence mode="wait">
                {loginMethod === 'emailPassword' && (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                      </div>
                                             <input
                         id="email"
                         type="email"
                         value={formData.email}
                         onChange={(e) => handleInputChange('email', e.target.value)}
                         className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-2 transition-all duration-300 ${
                           errors.email 
                             ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                             : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                         } focus:ring-2 focus:outline-none focus:bg-white hover:bg-white`}
                         placeholder="Enter your email"
                         disabled={isLoading}
                         required
                       />
                      {errors.email && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -bottom-6 left-0 text-sm text-red-600 flex items-center space-x-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.email}</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password Input */}
              <AnimatePresence mode="wait">
                {loginMethod === 'emailPassword' && (
                  <motion.div
                    key="password"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                      </div>
                                             <input
                         id="password"
                         type={showPassword ? 'text' : 'password'}
                         value={formData.password}
                         onChange={(e) => handleInputChange('password', e.target.value)}
                         className={`w-full pl-10 pr-12 py-3 bg-gray-50 rounded-xl border-2 transition-all duration-300 ${
                           errors.password 
                             ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                             : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                         } focus:ring-2 focus:outline-none focus:bg-white hover:bg-white`}
                         placeholder="Enter your password"
                         disabled={isLoading}
                         required
                       />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      {errors.password && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -bottom-6 left-0 text-sm text-red-600 flex items-center space-x-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.password}</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : `bg-gradient-to-r ${roleConfig[selectedRole].color} hover:shadow-xl transform hover:-translate-y-1 hover:scale-[1.02]`
                } text-white text-lg`}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-6 h-6" />
                    </motion.div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </motion.button>
            </form>



          {/* Quick Role Switch FAB */}
          <motion.div
            className="fixed bottom-6 right-6 lg:hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              onClick={() => setSelectedRole(selectedRole === 'TEACHER' ? 'PARENT' : 'TEACHER')}
              className="p-3 bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {React.createElement(roleConfig[selectedRole === 'TEACHER' ? 'PARENT' : 'TEACHER'].icon, { 
                className: "w-5 h-5 text-gray-600" 
              })}
            </motion.button>
          </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
