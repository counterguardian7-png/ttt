
import React from 'react';

const ImpulseCircuitDiagram: React.FC = () => {
  return (
    <div className="bg-gray-800/50 rounded-2xl shadow-2xl p-6 backdrop-blur-sm border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-100">Marx Generator Circuit</h2>
      <div className="w-full overflow-x-auto">
        <svg viewBox="0 0 450 200" className="min-w-[400px]" xmlns="http://www.w3.org/2000/svg">
          {/* Styles */}
          <defs>
            <style>
              {`
                .line { stroke: #9ca3af; stroke-width: 1.5; }
                .component { fill: none; stroke: #e5e7eb; stroke-width: 2; }
                .label { font-family: sans-serif; font-size: 10px; fill: #d1d5db; }
                .spark { stroke: #facc15; stroke-width: 1.5; stroke-linecap: round; }
              `}
            </style>
          </defs>

          {/* Charging Resistors */}
          <path className="line" d="M10 50 L30 50 M10 100 L30 100 M10 150 L30 150" />
          <path className="component" d="M30 45 l5 10 l10 -10 l10 10 l10 -10 l5 10" />
          <path className="component" d="M30 95 l5 10 l10 -10 l10 10 l10 -10 l5 10" />
          <path className="component" d="M30 145 l5 10 l10 -10 l10 10 l10 -10 l5 10" />
          <text x="45" y="35" className="label" textAnchor="middle">Rc</text>

          {/* Stage Capacitors */}
          <path className="line" d="M80 50 L100 50 M80 100 L100 100 M80 150 L100 150" />
          <path className="component" d="M100 35 L100 65 M110 35 L110 65" />
          <path className="component" d="M100 85 L100 115 M110 85 L110 115" />
          <path className="component" d="M100 135 L100 165 M110 135 L110 165" />
          <text x="120" y="50" className="label">C1</text>
          <text x="120" y="100" className="label">C1</text>
          <text x="120" y="150" className="label">C1</text>
          
          {/* Connections & Spark Gaps */}
          <path className="line" d="M80 50 L80 100 L80 150" />
          <path className="line" d="M110 65 L150 65" />
          <path className="line" d="M110 115 L150 115" />
          <path className="line" d="M110 165 L150 165" />
          
          {/* Spark Gaps */}
          <circle cx="160" cy="65" r="3" className="component" />
          <circle cx="170" cy="90" r="3" className="component" />
          <path className="spark" d="M163 65 L167 90" />
          
          <circle cx="160" cy="115" r="3" className="component" />
          <circle cx="170" cy="140" r="3" className="component" />
          <path className="spark" d="M163 115 L167 140" />

          <path className="line" d="M110 35 L200 35" />
          <path className="line" d="M170 90 L200 90" />
          <path className="line" d="M170 140 L200 140" />
          <path className="line" d="M200 35 L200 140" />
          
          {/* Dots indicate more stages */}
          <circle cx="185" cy="175" r="1" fill="#d1d5db" />
          <circle cx="195" cy="175" r="1" fill="#d1d5db" />
          <circle cx="205" cy="175" r="1" fill="#d1d5db" />

          {/* Output circuit */}
          <path className="line" d="M200 35 L220 35" />
          {/* R1 */}
          <path className="component" d="M220 30 l5 10 l10 -10 l10 10 l10 -10 l5 10" />
          <text x="245" y="25" className="label" textAnchor="middle">R1</text>
          <path className="line" d="M270 35 L320 35" />
          
          {/* Load */}
          <path className="line" d="M320 35 L320 100" />
          <text x="330" y="80" className="label">V_out</text>
          
          {/* C2 */}
          <path className="component" d="M310 100 L310 130 M330 100 L330 130" />
          <text x="340" y="115" className="label">C2</text>
          <path className="line" d="M320 130 L320 180" />
          
          {/* R2 */}
          <path className="line" d="M200 180 L230 180" />
          <path className="component" d="M230 175 l5 10 l10 -10 l10 10 l10 -10 l5 10" />
          <text x="255" y="170" className="label" textAnchor="middle">R2</text>
          <path className="line" d="M280 180 L320 180" />

          {/* Ground */}
          <path className="line" d="M320 180 L320 185" />
          <path className="line" d="M310 185 L330 185" />
          <path className="line" d="M315 190 L325 190" />
          <path className="line" d="M318 195 L322 195" />

          {/* HV Source */}
          <text x="10" y="100" className="label" transform="rotate(-90 10 100)">HV DC</text>
        </svg>
      </div>
    </div>
  );
};

export default ImpulseCircuitDiagram;
