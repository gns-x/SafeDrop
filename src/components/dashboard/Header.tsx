import { User, LogOut } from 'lucide-react';
import { Location } from '../../types/location';

interface HeaderProps {
    userName: string;
    isLoadingLocation: boolean;
    isWithinRange: (location: Location | null) => boolean;
    currentLocation: Location | null;
    onLogout: () => void;
}

export function Header({ userName, onLogout }: HeaderProps) {
    return (
        <header className="bg-white shadow-md relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Welcome Message */}
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Welcome back,</h1>
                            <p className="text-sm text-gray-600">{userName}</p>
                        </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center space-x-6">
                        {/* Location Status */}
                        {/* <div className="flex items-center">
                            {isLoadingLocation ? (
                                <div className="flex items-center text-gray-600">
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    <span className="text-sm">Getting location...</span>
                                </div>
                            ) : (
                                <div className={`flex items-center px-4 py-2 rounded-full ${isWithinRange(currentLocation)
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-red-50 text-red-700'
                                    }`}>
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium">
                                        {isWithinRange(currentLocation) ? 'In School Range' : 'Out of Range'}
                                    </span>
                                </div>
                            )}
                        </div> */}

                        {/* Logout Button */}
                        <button
                            onClick={onLogout}
                            className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
