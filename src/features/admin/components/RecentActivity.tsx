"use client";

import React from "react";
import { Clock, User, ShoppingCart, AlertCircle } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "order" | "user" | "alert";
  message: string;
  timestamp: string;
  user?: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

export default function RecentActivity({ activities = [] }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="w-4 h-4 text-blue-500" />;
      case "user":
        return <User className="w-4 h-4 text-green-500" />;
      case "alert":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-50 border-blue-200";
      case "user":
        return "bg-green-50 border-green-200";
      case "alert":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gray-600" />
          Actividad Reciente
        </h3>
      </div>      <div className="p-6">
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className={`flex items-start space-x-3 p-3 rounded-lg border ${getActivityColor(activity.type)}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  {activity.user && (
                    <p className="text-xs text-gray-500 mt-1">
                      Usuario: {activity.user}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs text-gray-500">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay actividad reciente
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              La actividad aparecerá aquí cuando ocurra.
            </p>
          </div>
        )}
      </div>
{/* 
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Ver toda la actividad
        </button>
      </div> */}
    </div>
  );
}
