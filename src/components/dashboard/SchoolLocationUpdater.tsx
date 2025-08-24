import React, { useState, useEffect } from 'react';
import { MapPin, Save, RotateCcw, Navigation, Globe, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { SCHOOL_LOCATION } from '../../config/constants';
import { SchoolLocation } from '../../types/location';
import toast from 'react-hot-toast';

interface SchoolLocationUpdaterProps {
  onLocationUpdate: (newLocation: SchoolLocation) => void;
  currentLocation?: SchoolLocation;
}

export function SchoolLocationUpdater({ onLocationUpdate, currentLocation }: SchoolLocationUpdaterProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SchoolLocation>({
    latitude: currentLocation?.latitude || SCHOOL_LOCATION.latitude,
    longitude: currentLocation?.longitude || SCHOOL_LOCATION.longitude,
    radius: currentLocation?.radius || SCHOOL_LOCATION.radius
  });
  const [reason, setReason] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.latitude || formData.latitude < -90 || formData.latitude > 90) {
      errors.latitude = 'Latitude must be between -90 and 90 degrees';
    }

    if (!formData.longitude || formData.longitude < -180 || formData.longitude > 180) {
      errors.longitude = 'Longitude must be between -180 and 180 degrees';
    }

    if (!formData.radius || formData.radius < 100 || formData.radius > 5000) {
      errors.radius = 'Radius must be between 100 and 5000 meters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof SchoolLocation, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, [field]: numValue }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData(prev => ({
              ...prev,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }));
            toast.success('Current location captured successfully!');
          },
          (error) => {
            toast.error('Failed to get current location. Please check permissions.');
          }
        );
      } else {
        toast.error('Geolocation is not supported by this browser.');
      }
    } catch (error) {
      toast.error('Error getting location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create location data with reason
      const locationData = {
        ...formData,
        reason: reason.trim() || undefined
      };
      
      onLocationUpdate(locationData);
      setIsEditing(false);
      setReason(''); // Reset reason after successful update
      toast.success('School location updated successfully! 🎉');
    } catch (error) {
      toast.error('Failed to update location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      latitude: currentLocation?.latitude || SCHOOL_LOCATION.latitude,
      longitude: currentLocation?.longitude || SCHOOL_LOCATION.longitude,
      radius: currentLocation?.radius || SCHOOL_LOCATION.radius
    });
    setValidationErrors({});
    setIsEditing(false);
  };

  const formatCoordinate = (value: number): string => {
    return value.toFixed(6);
  };

  const formatRadius = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} km`;
    }
    return `${value} m`;
  };

  return (
    <Card variant="glass" className="relative overflow-hidden">
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      <CardHeader className="relative">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              School Location Settings
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Configure the school's pickup zone and safety radius
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {!isEditing ? (
          // Display Mode
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Latitude</span>
                </div>
                <p className="text-lg font-mono font-semibold text-gray-900">
                  {formatCoordinate(formData.latitude)}°
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Navigation className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Longitude</span>
                </div>
                <p className="text-lg font-mono font-semibold text-gray-900">
                  {formatCoordinate(formData.longitude)}°
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Safety Radius</span>
                </div>
                <p className="text-lg font-mono font-semibold text-gray-900">
                  {formatRadius(formData.radius)}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50">
              <div className="flex items-center space-x-2 text-blue-700">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Current Configuration Active</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Parents can only request pickups within this defined zone
              </p>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Latitude</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.latitude 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200 bg-white/80 hover:bg-white focus:bg-white'
                  }`}
                  placeholder="Enter latitude (-90 to 90)"
                />
                {validationErrors.latitude && (
                  <div className="flex items-center space-x-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{validationErrors.latitude}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-green-600" />
                  <span>Longitude</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    validationErrors.longitude 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200 bg-white/80 hover:bg-white focus:bg-white'
                  }`}
                  placeholder="Enter longitude (-180 to 180)"
                />
                {validationErrors.longitude && (
                  <div className="flex items-center space-x-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{validationErrors.longitude}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Safety Radius (meters)</span>
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={formData.radius}
                  onChange={(e) => handleInputChange('radius', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100m</span>
                  <span className="font-medium text-purple-600">{formatRadius(formData.radius)}</span>
                  <span>5km</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                This defines the safe pickup zone around the school
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Update Reason (Optional)</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why are you updating the school location? (e.g., safety concerns, new building, etc.)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500">
                Providing a reason helps maintain an audit trail of location changes
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200/50">
              <div className="flex items-center space-x-2 text-amber-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Location Update</span>
              </div>
              <p className="text-xs text-amber-600 mt-1">
                Changes will affect all pickup requests. Ensure coordinates are accurate.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="relative">
        <div className="flex items-center space-x-3 w-full">
          {!isEditing ? (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Update Location
              </Button>
              <Button
                onClick={handleGetCurrentLocation}
                disabled={isLoading}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 bg-white text-gray-700 hover:bg-blue-50"
              >
                <Navigation className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={handleReset}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 bg-white text-gray-700 hover:bg-red-50"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
