import { useState, useRef } from 'react';
import {
  Info,
  ShieldCheck,
  ArrowRightLeft,
  MousePointer2,
  Hash,
  Activity,
  ZoomIn,
  ZoomOut,
  Maximize
} from 'lucide-react';

const mindMapData = {
  label: "Marketing SOP Task Lifecycle",
  subtitle: "Marketing captures and prepares handover. Sales qualifies and verifies new logos.",
  isRoot: true,
  color: "gray",
  children: [
    {
      label: "1. Preparation",
      owner: "Marketing",
      color: "blue",
      children: [
        {
          label: "Review Weekly Targets",
          children: [{ label: "500 new logos / year" }, { label: "250 leads / month" }, { label: "Weekly pacing" }]
        },
        {
          label: "Review Campaign Plan",
          children: [
            { label: "Content calendar" },
            { label: "Ads" },
            { label: "Events / Partnerships" },
            { label: "Website work" }
          ]
        },
        {
          label: "Prepare Assets",
          children: [{ label: "Creatives" }, { label: "CTAs" }, { label: "Forms" }, { label: "Tracking links" }]
        },
        {
          label: "ClickUp Lists (Setup)",
          fields: ["Brand", "Primary KPI", "Campaign Name", "Channel", "Marketing Owner"],
          children: [
            { label: "Campaigns & Content" },
            { label: "Events & Partnerships" },
            { label: "Website Ops" },
            { label: "Marketing Operations" },
            { label: "Marketing Requests To Admin" }
          ]
        }
      ]
    },
    {
      label: "2. Execution",
      owner: "Marketing",
      color: "blue",
      children: [
        {
          label: "Campaigns & Content",
          statuses: ["Backlog", "Planned", "In Production", "Ready to Publish", "Live", "Done / Cancelled"],
          fields: ["Work Type", "Target Leads", "Target Logos", "Planned Publish Date", "Actual Publish Date", "Budget", "Is Evergreen"]
        },
        {
          label: "Events & Partnerships",
          statuses: ["Backlog", "Planned", "Confirmed", "Active", "Completed", "Cancelled"],
          fields: ["Activity Type", "Event Date", "Location", "Partner/Host", "Expected Leads/Logos", "Actual Leads/Logos", "Budget/Spend", "Linked Campaign"]
        },
        {
          label: "Website Ops",
          statuses: ["Backlog", "Scoped", "In Progress", "In Review", "Ready to Release", "Live"],
          fields: ["Page / Area", "Release Type"]
        }
      ]
    },
    {
      label: "3. Lead Capture",
      owner: "Marketing",
      color: "blue",
      note: "Capture happens in Sales Pipeline process.",
      children: [
        {
          label: "Capture Fields",
          fields: ["Brand", "Lead Source/Channel", "Campaign", "Contact Name", "Contact Phone/Email", "Company Name", "Product Interest", "Marketing Owner", "Date Received"]
        }
      ]
    },
    {
      label: "4. Initial Engagement",
      owner: "Marketing",
      color: "blue",
      children: [
        { label: "Acknowledge Inquiry" },
        { label: "Record Notes (Need, Location, Timeline)" },
        {
          label: "Current Status",
          statuses: ["Contacted (Marketing)"]
        }
      ]
    },
    {
      label: "5. Handover Preparation",
      owner: "Marketing",
      color: "orange",
      note: "Boundary between Marketing and Sales.",
      children: [
        {
          label: "Transition Fields",
          fields: ["Sales Owner Assigned", "Next Step Noted"],
          statuses: ["Handover to Sales"]
        }
      ]
    },
    {
      label: "6. Sales Pipeline Stage",
      owner: "Sales",
      color: "green",
      children: [
        {
          label: "Sales Qualification",
          statuses: ["New Lead (Unworked)", "Qualified (Sales)", "In Progress (Sales)"]
        }
      ]
    },
    {
      label: "7. Logo Verification",
      owner: "Sales",
      color: "green",
      children: [
        {
          label: "Outcome",
          statuses: ["Won (New Logo Verified)", "Lost / Not a Fit", "Invalid / Duplicate"],
          fields: ["Verification Date", "Win/Loss Reason"]
        }
      ]
    },
    {
      label: "8. Reporting & Optimization",
      owner: "Marketing + Sales",
      color: "purple",
      children: [
        {
          label: "Marketing Operations",
          statuses: ["Backlog", "Planned", "In Progress", "Waiting on Input", "Complete"],
          fields: ["Ops Area"]
        },
        {
          label: "Marketing Requests To Admin",
          statuses: ["New Request", "Triage", "Assigned", "Waiting on External Team", "Delivered", "Closed"],
          fields: ["Request Type", "Requested Team", "Due Date", "SLA Breach?"]
        },
        {
          label: "Performance Review",
          note: "Review data from all other lists to improve ROI and conversion."
        }
      ]
    }
  ]
};

const getColors = (color) => {
  switch (color) {
    case 'blue':
      return {
        border: 'border-blue-400',
        text: 'text-blue-900',
        line: 'bg-blue-300',
        btn: 'text-blue-500',
        bg: 'bg-blue-50',
        ownerBg: 'bg-blue-100',
        ownerText: 'text-blue-700'
      };
    case 'orange':
      return {
        border: 'border-orange-400',
        text: 'text-orange-900',
        line: 'bg-orange-300',
        btn: 'text-orange-500',
        bg: 'bg-orange-50',
        ownerBg: 'bg-orange-100',
        ownerText: 'text-orange-700'
      };
    case 'green':
      return {
        border: 'border-green-400',
        text: 'text-green-900',
        line: 'bg-green-300',
        btn: 'text-green-500',
        bg: 'bg-green-50',
        ownerBg: 'bg-green-100',
        ownerText: 'text-green-700'
      };
    case 'purple':
      return {
        border: 'border-purple-400',
        text: 'text-purple-900',
        line: 'bg-purple-300',
        btn: 'text-purple-500',
        bg: 'bg-purple-50',
        ownerBg: 'bg-purple-100',
        ownerText: 'text-purple-700'
      };
    default:
      return {
        border: 'border-slate-400',
        text: 'text-slate-900',
        line: 'bg-slate-300',
        btn: 'text-slate-500',
        bg: 'bg-slate-50',
        ownerBg: 'bg-slate-200',
        ownerText: 'text-slate-700'
      };
  }
};

const MindMapNode = ({ node, isRoot = false }) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const colors = getColors(node.color);

  return (
    <div className="flex items-center">
      <div
        className={`
        relative bg-white shadow-sm transition-all hover:shadow-md z-10 flex flex-col
        ${isRoot ? 'border-[3px] rounded-2xl px-6 py-4 min-w-[300px]' : 'border-2 rounded-xl px-4 py-3 min-w-[240px] max-w-[280px]'}
        ${colors.border} ${colors.text}
      `}
      >
        <div className={`${isRoot ? 'text-lg font-bold' : 'text-sm font-bold'} flex justify-between items-start`}>
          <span>{node.label}</span>
          {node.owner && (
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${colors.ownerBg} ${colors.ownerText}`}
            >
              {node.owner}
            </span>
          )}
        </div>

        {node.subtitle && <div className="text-xs font-medium mt-1 text-slate-500">{node.subtitle}</div>}
        {node.note && (
          <div className="text-[10px] mt-2 text-amber-700 bg-amber-50 p-2 rounded italic border border-amber-100">
            {node.note}
          </div>
        )}

        {node.statuses && (
          <div className="mt-3">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 mb-1">
              <Activity size={12} /> Statuses
            </div>
            <div className="flex flex-wrap gap-1">
              {node.statuses.map((s, idx) => (
                <span
                  key={idx}
                  className="text-[9px] px-1.5 py-0.5 rounded-sm bg-slate-100 border border-slate-200 text-slate-600 whitespace-nowrap"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {node.fields && (
          <div className="mt-3">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 mb-1">
              <Hash size={12} /> Fields
            </div>
            <div className="grid grid-cols-1 gap-0.5">
              {node.fields.map((f, idx) => (
                <div key={idx} className="text-[10px] text-slate-500 flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-slate-300" /> {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {hasChildren && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center text-lg font-bold cursor-pointer hover:bg-slate-50 z-20 ${colors.border} ${colors.btn}`}
          >
            {collapsed ? '+' : '−'}
          </button>
        )}
      </div>

      {hasChildren && !collapsed && (
        <>
          <div className={`w-12 h-[2px] ${colors.line} z-0`}></div>
          <div className="flex flex-col relative py-4">
            {node.children.map((child, i) => (
              <div key={i} className="relative flex items-center pl-12 py-2">
                <div className={`absolute left-0 top-1/2 w-12 h-[2px] -translate-y-1/2 ${colors.line} z-0`}></div>
                {node.children.length > 1 && (
                  <div
                    className={`absolute left-0 w-[2px] ${colors.line} z-0
                    ${i === 0 ? 'top-1/2 h-1/2' : ''}
                    ${i === node.children.length - 1 ? 'top-0 h-1/2' : ''}
                    ${i > 0 && i < node.children.length - 1 ? 'top-0 h-full' : ''}
                  `}
                  ></div>
                )}
                <MindMapNode node={{ ...child, color: child.color || node.color }} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function App() {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    setIsDragging(true);
    setDragStart({
      x: e.pageX - scrollRef.current.offsetLeft,
      y: e.pageY - scrollRef.current.offsetTop,
      scrollLeft: scrollRef.current.scrollLeft,
      scrollTop: scrollRef.current.scrollTop
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const y = e.pageY - scrollRef.current.offsetTop;
    scrollRef.current.scrollLeft = dragStart.scrollLeft - (x - dragStart.x);
    scrollRef.current.scrollTop = dragStart.scrollTop - (y - dragStart.y);
  };

  const handleZoom = (delta) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.4), 1.5));
  };

  const resetZoom = () => setZoom(0.85);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f8fafc] font-sans flex flex-col">
      <div className="absolute top-0 w-full p-4 pointer-events-none z-50 flex justify-between items-center">
        <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-md text-xs font-bold text-slate-700 flex items-center gap-3 border border-slate-200 uppercase tracking-widest pointer-events-auto">
          <MousePointer2 size={16} className="text-blue-500 animate-pulse" /> Drag to Pan • +/- to Collapse
        </div>

        <div className="bg-white/90 backdrop-blur p-1 rounded-2xl shadow-md border border-slate-200 flex items-center gap-1 pointer-events-auto">
          <button
            onClick={() => handleZoom(-0.1)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <div className="w-16 text-center text-[11px] font-black text-slate-400 tabular-nums">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={() => handleZoom(0.1)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <div className="w-[1px] h-6 bg-slate-200 mx-1" />
          <button
            onClick={resetZoom}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
            title="Reset Zoom"
          >
            <Maximize size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`w-full h-full overflow-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
          backgroundSize: `${30 * zoom}px ${30 * zoom}px`
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <div
          className="min-w-max p-40 flex justify-start items-center min-h-[120%] origin-left"
          style={{ transform: `scale(${zoom})`, transition: 'transform 0.1s ease-out' }}
        >
          <MindMapNode node={mindMapData} isRoot={true} />
        </div>
      </div>

      <div className="absolute bottom-6 right-6 flex flex-col gap-4 z-40 w-80 pointer-events-none">
        <div className="p-4 rounded-2xl shadow-xl border-l-[6px] border-blue-500 bg-white/95 backdrop-blur ring-1 ring-black/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-1.5 rounded-lg">
              <Info size={18} className="text-blue-600" />
            </div>
            <h4 className="font-black text-sm text-slate-900 uppercase tracking-tight">Callout 1 — Ownership</h4>
          </div>
          <p className="text-xs font-medium text-slate-600 pl-10 leading-relaxed">
            Marketing owns capture, initial engagement, and handover readiness.
          </p>
        </div>

        <div className="p-4 rounded-2xl shadow-xl border-l-[6px] border-green-500 bg-white/95 backdrop-blur ring-1 ring-black/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-1.5 rounded-lg">
              <ShieldCheck size={18} className="text-green-600" />
            </div>
            <h4 className="font-black text-sm text-slate-900 uppercase tracking-tight">Callout 2 — Sales</h4>
          </div>
          <p className="text-xs font-medium text-slate-600 pl-10 leading-relaxed">
            Sales owns qualification, pipeline progression, won/lost outcome, and logo verification.
          </p>
        </div>

        <div className="p-4 rounded-2xl shadow-xl border-l-[6px] border-orange-500 bg-white/95 backdrop-blur ring-1 ring-black/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 p-1.5 rounded-lg">
              <ArrowRightLeft size={18} className="text-orange-600" />
            </div>
            <h4 className="font-black text-sm text-slate-900 uppercase tracking-tight">Callout 3 — Boundary</h4>
          </div>
          <p className="text-xs font-medium text-slate-600 pl-10 leading-relaxed">
            Marketing does not qualify leads and does not verify logos.
          </p>
        </div>
      </div>
    </div>
  );
}
