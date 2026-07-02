// FILE: src/app/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Incident, ActionItem, TimelineEvent, AppSettings } from '@/lib/types';
import { validateInput } from '@/lib/validate';
import { z } from 'zod';
import { Bar as BarChart, Line as LineChart } from 'react-chartjs-2';
import 'chart.js/auto';

const schema = z.object({
  incidents: z.array(z.any()),
  actionItems: z.array(z.any()),
  settings: z.any(),
});

const DashboardPage = () => {
  const { state, dispatch } = useStore();
  const [metrics, setMetrics] = useState({
    totalIncidents: 0,
    activeIncidents: 0,
    mttr: 0,
    actionCompletionRate: 0,
  });

  useEffect(() => {
    const validatedData = {
      incidents: state.incidents,
      actionItems: state.actionItems,
      settings: state.settings,
    };

    const totalIncidents = validatedData.incidents.length;
    const activeIncidents = validatedData.incidents.filter(
      (incident: Incident) => incident.status !== 'Resolved'
    ).length;
    const resolvedIncidents = validatedData.incidents.filter(
      (incident: Incident) => incident.status === 'Resolved'
    );
    const totalResolutionTime = resolvedIncidents.reduce(
      (sum: number, incident: Incident) =>
        sum + (incident.resolvedAt ? incident.resolvedAt - incident.detectedAt : 0),
      0
    );
    const mttr = totalResolutionTime / resolvedIncidents.length || 0;
    const completedActions = validatedData.actionItems.filter(
      (action: ActionItem) => action.status === 'Done'
    ).length;
    const totalActions = validatedData.actionItems.length;
    const actionCompletionRate = (completedActions / totalActions) * 100 || 0;

    setMetrics({ totalIncidents, activeIncidents, mttr, actionCompletionRate });
  }, [state]);

  const incidentSeverityCounts = state.incidents.reduce((acc: any, incident: Incident) => {
    acc[incident.severity] = (acc[incident.severity] || 0) + 1;
    return acc;
  }, {});

  const recentActivity = [
    ...state.incidents.map((incident: Incident) => ({
      type: 'incident',
      timestamp: incident.updatedAt,
      description: `${incident.title} marked as ${incident.status}`,
    })),
    ...state.actionItems.map((action: ActionItem) => ({
      type: 'action',
      timestamp: action.updatedAt,
      description: `${action.title} marked as ${action.status}`,
    })),
  ].sort((a: any, b: any) => b.timestamp - a.timestamp);

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8]">
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-5">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="card">
            <h2 className="text-lg font-semibold">Total Incidents</h2>
            <p>{metrics.totalIncidents}</p>
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold">Active Incidents</h2>
            <p>{metrics.activeIncidents}</p>
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold">MTTR (hours)</h2>
            <p>{(metrics.mttr / 3600).toFixed(2)}</p>
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold">Action Completion Rate (%)</h2>
            <p>{metrics.actionCompletionRate.toFixed(2)}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="card">
            <h2 className="text-lg font-semibold">Incident Distribution by Severity</h2>
            <BarChart
              data={{
                labels: ['P1', 'P2', 'P3', 'P4'],
                datasets: [
                  {
                    label: 'Incidents',
                    data: [incidentSeverityCounts.P1 || 0, incidentSeverityCounts.P2 || 0, incidentSeverityCounts.P3 || 0, incidentSeverityCounts.P4 || 0],
                    backgroundColor: ['#5e6ad2', '#3b82f6', '#f59e0b', '#ef4444'],
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <ul className="space-y-2">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <li key={index}>
                  <span className="text-sm">{new Date(activity.timestamp).toLocaleString()}</span> -{' '}
                  <span className="text-sm">{activity.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;