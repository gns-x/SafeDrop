import React, { useState, useEffect } from 'react';
import { Clock, User, MapPin, Calendar, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { LocationHistoryEntry } from '../../services/location-management.service';

interface LocationHistoryProps {
  history: LocationHistoryEntry[];
  isLoading?: boolean;
}

export function LocationHistory({ history, isLoading = false }: LocationHistoryProps) {
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEntries(newExpanded);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const displayedHistory = showAll ? history : history.slice(0, 5);

  if (isLoading) {
    return (
      <Card variant="glass" className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Location Update History</span>
          </CardTitle>
          <CardDescription>Loading history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card variant="glass" className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Location Update History</span>
          </CardTitle>
          <CardDescription>No location updates recorded yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Location history will appear here after the first update</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="relative overflow-hidden">
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-gray-50/30 to-blue-50/50" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-slate-500 to-blue-600 rounded-xl">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Location Update History
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Track all changes to school location settings
              </CardDescription>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {history.length} update{history.length !== 1 ? 's' : ''}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {displayedHistory.map((entry, index) => (
          <div
            key={entry.id}
            className={`bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-200 hover:shadow-md ${
              expandedEntries.has(entry.id) ? 'ring-2 ring-blue-200' : ''
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{entry.updatedBy}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(entry.updatedAt)}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => toggleExpanded(entry.id)}
                  className="p-1 h-8 w-8 hover:bg-blue-50 bg-transparent text-gray-600 hover:text-blue-600"
                >
                  {expandedEntries.has(entry.id) ? (
                    <ChevronUp className="w-4 h-4 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-blue-600" />
                  )}
                </Button>
              </div>

              {expandedEntries.has(entry.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200/50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50/50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">Latitude</span>
                      </div>
                      <p className="text-sm font-mono text-blue-900">
                        {formatCoordinate(entry.latitude)}°
                      </p>
                    </div>
                    
                    <div className="bg-green-50/50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-green-700">Longitude</span>
                      </div>
                      <p className="text-sm font-mono text-green-900">
                        {formatCoordinate(entry.longitude)}°
                      </p>
                    </div>
                    
                    <div className="bg-purple-50/50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">Radius</span>
                      </div>
                      <p className="text-sm font-mono text-purple-900">
                        {formatRadius(entry.radius)}
                      </p>
                    </div>
                  </div>

                  {entry.reason && (
                    <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <Eye className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-medium text-amber-700">Update Reason</span>
                      </div>
                      <p className="text-sm text-amber-800">{entry.reason}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {history.length > 5 && (
          <div className="text-center pt-4">
            <Button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 bg-white text-gray-700 hover:bg-blue-50"
            >
              {showAll ? 'Show Less' : `Show All ${history.length} Updates`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
