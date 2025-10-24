 import React from 'react';

function Ring({ size, strokeWidth, progress, color, radius, center }) {
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#2d2d2d"
        strokeWidth={strokeWidth}
        opacity={0.2}
      />
      {/* Progress circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
        style={{
          filter: progress > 0 ? `drop-shadow(0 0 8px ${color}80)` : 'none',
        }}
      />
    </>
  );
}

function StackedRings({
  applications,
  goal,
  size,
  showLabel = false,
  label = ''
}) {
  const center = size / 2;
  const baseStrokeWidth = size > 200 ? 16 : 6;
  const spacing = size > 200 ? 14 : 5;

  // Calculate progress for three rings
  const applications1 = Math.min(applications, goal);
  const applications2 = Math.max(0, Math.min(applications - goal, goal));
  const applications3 = Math.max(0, applications - (goal * 2));

  const progress1 = Math.min((applications1 / goal) * 100, 100);
  const progress2 = Math.min((applications2 / goal) * 100, 100);
  const progress3 = Math.min((applications3 / goal) * 100, 100);

  // Ring colors (Apple Watch style)
  const colors = {
    outer: '#ff2d55', // Pink/Red - Main applications
    middle: '#7aff00', // Bright Green - Secondary goal
    inner: '#00e7ff', // Cyan - Tertiary goal
  };

  // Calculate radii for nested rings
  const outerRadius = (size / 2) - (baseStrokeWidth / 2) - 4;
  const middleRadius = outerRadius - baseStrokeWidth - spacing;
  const innerRadius = middleRadius - baseStrokeWidth - spacing;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.15))' }}
      >
        {/* Outer Ring - Main Applications */}
        <Ring
          size={size}
          strokeWidth={baseStrokeWidth}
          progress={progress1}
          color={colors.outer}
          radius={outerRadius}
          center={center}
        />

        {/* Middle Ring - Bonus Applications */}
        <Ring
          size={size}
          strokeWidth={baseStrokeWidth}
          progress={progress2}
          color={colors.middle}
          radius={middleRadius}
          center={center}
        />

        {/* Inner Ring - Extra Applications */}
        <Ring
          size={size}
          strokeWidth={baseStrokeWidth}
          progress={progress3}
          color={colors.inner}
          radius={innerRadius}
          center={center}
        />

        {/* Center text for large rings */}
        {size > 200 && (
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dy="0.3em"
            className="transform rotate-90"
            style={{
              fontSize: '48px',
              fontWeight: '700',
              fill: '#fff',
              transformOrigin: '50% 50%',
            }}
          >
            {applications}
          </text>
        )}
      </svg>

      {showLabel && (
        <div className="text-center">
          <div className="text-xs opacity-60">{label}</div>
        </div>
      )}
    </div>
  );
}

export function ActivityRings({ weekData, showLarge = true, largeIndex = 6 }) {
  return (
    <div className="space-y-8">
      {/* Weekly small rings at top */}
      <div className="flex items-center justify-center gap-3">
        {weekData.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <StackedRings
              applications={day.applications}
              goal={day.goal}
              size={60}
              showLabel={false}
            />
            <div className="text-xs text-white font-medium">{day.day}</div>
          </div>
        ))}
      </div>

      {/* Large ring for today */}
      {showLarge && (
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4">
            <h3 className="text-center mb-1">Today's Progress</h3>
            <p className="text-sm opacity-60 text-center">
              {weekData[largeIndex]?.day} - {weekData[largeIndex]?.applications} applications
            </p>
          </div>
          <StackedRings
            applications={weekData[largeIndex]?.applications || 0}
            goal={weekData[largeIndex]?.goal || 5}
            size={280}
          />
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full" style={{ backgroundColor: '#ff2d55' }}></div>
              <span className="opacity-70">Goal 1 (0-5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full" style={{ backgroundColor: '#7aff00' }}></div>
              <span className="opacity-70">Goal 2 (6-10)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full" style={{ backgroundColor: '#00e7ff' }}></div>
              <span className="opacity-70">Goal 3 (11+)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}