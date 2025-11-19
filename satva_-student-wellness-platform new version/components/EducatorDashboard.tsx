import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChakraName, ChakraStatus } from '../types';
import { getEducatorDashboardData } from '../services/geminiService';

const COLORS = {
    [ChakraStatus.Blocked]: '#F87171', // red-400
    [ChakraStatus.Balanced]: '#4ADE80', // green-400
    [ChakraStatus.Overactive]: '#FBBF24', // amber-400
};

type Tab = 'trends' | 'alerts';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A78BFA]"></div>
        <p className="ml-4 text-white/70">Generating dynamic dashboard data...</p>
    </div>
);

const EducatorDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('trends');
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<{ chakraStatusData: any[], highStressStudents: any[] }>({ chakraStatusData: [], highStressStudents: [] });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getEducatorDashboardData();
                setDashboardData(data);
            } catch (error) {
                console.error("Failed to load educator dashboard data", error);
                setDashboardData({ chakraStatusData: [], highStressStudents: [] });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    
    return (
        <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8">Educator Dashboard</h2>
            
            <div className="mb-6 border-b border-white/10">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('trends')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'trends' ? 'border-[#A78BFA] text-white' : 'border-transparent text-white/50 hover:text-white hover:border-white/20'}`}
                    >
                        Chakra Imbalance Trends
                    </button>
                    <button
                        onClick={() => setActiveTab('alerts')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'alerts' ? 'border-[#A78BFA] text-white' : 'border-transparent text-white/50 hover:text-white hover:border-white/20'}`}
                    >
                        High-Stress Alerts
                    </button>
                </nav>
            </div>
            
            <div className="glass-card p-6 rounded-2xl min-h-[450px]">
              {isLoading ? <LoadingSpinner /> : (
                <>
                  {activeTab === 'trends' && (
                    <>
                      <h3 className="text-xl font-semibold text-white/90 mb-4">Overall Student Chakra Status</h3>
                      <div style={{ width: '100%', height: 400 }}>
                          <ResponsiveContainer>
                              <BarChart data={dashboardData.chakraStatusData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                                  <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.1)'}}
                                    contentStyle={{
                                      background: 'rgba(10,10,20,0.8)',
                                      borderColor: 'rgba(255,255,255,0.2)',
                                      borderRadius: '10px',
                                      fontFamily: 'Inter, sans-serif'
                                    }} 
                                  />
                                  <Legend wrapperStyle={{fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.8)'}}/>
                                  <Bar dataKey="Blocked" stackId="a" fill={COLORS.Blocked} />
                                  <Bar dataKey="Balanced" stackId="a" fill={COLORS.Balanced} />
                                  <Bar dataKey="Overactive" stackId="a" fill={COLORS.Overactive} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                    </>
                  )}
                  
                  {activeTab === 'alerts' && (
                    <>
                       <h3 className="text-xl font-semibold text-white/90 mb-4">Students Showing High Stress Levels</h3>
                      <div className="overflow-x-auto">
                          <table className="min-w-full">
                              <thead>
                                  <tr>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Student ID</th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Name</th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Avg. Mood (0-100)</th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Flagged Entries</th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">Action</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-white/10">
                                  {dashboardData.highStressStudents.map((student) => (
                                      <tr key={student.id} className="hover:bg-white/5 transition-colors">
                                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white/90">{student.id}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">{student.name}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                                              <span className="font-semibold" style={{color: student.avgMood < 33 ? '#F87171' : '#FBBF24'}}>{student.avgMood}</span>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">{student.flaggedEntries}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                              <button className="text-[#A78BFA] hover:text-[#C4B5FD]">Reach Out</button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
        </div>
    );
};

export default EducatorDashboard;