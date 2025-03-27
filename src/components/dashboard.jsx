import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import styles from '../styles/dashboard.module.css';
import axios from 'axios';
import { Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Cell, ResponsiveContainer, RadialBarChart, RadialBar, AreaChart, Area, ScatterChart, Scatter, PieChart, Pie } from 'recharts';
import { generatePDF, generateGenderPDF, generateImageUploadPDF, generateFeedbackPDF, generateSkincareRoutinePDF, generateMedicationPDF, generateDailyAnalysisPDF, generateUserEmailPDF } from './pdf';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [results, setResults] = useState([]);
    const [medications, setMedications] = useState([]);
    const [skincareRoutines, setSkincareRoutines] = useState([]);

    const API_BASE = "http://localhost:8000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get(`${API_BASE}/users`);
                const feedbackResponse = await axios.get(`${API_BASE}/feedbacks`);
                const resultsResponse = await axios.get(`${API_BASE}/results`);
                const medicationsResponse = await axios.get(`${API_BASE}/get_medications/`);
                const skincareRoutinesResponse = await axios.get(`${API_BASE}/get_skincare_routines/`);

                setUsers(usersResponse.data.users || []);
                setFeedbacks(feedbackResponse.data.feedbacks || []);
                setResults(resultsResponse.data.results || []);
                setMedications(medicationsResponse.data.medications || []);
                setSkincareRoutines(skincareRoutinesResponse.data.routines || []);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Filter out admin users
    const filteredUsers = users.filter(user => user.role?.toLowerCase() !== 'admin');

    // Group medications by date
    const medicationData = medications.reduce((acc, medication) => {
        const date = medication.created_at ? new Date(medication.created_at).toISOString().split('T')[0] : 'No Date';
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    // Convert medication data to chart format
    const medicationChartData = Object.entries(medicationData).map(([date, count]) => ({
        date,
        count,
    }));

    // Calculate gender distribution excluding admin users
    const maleCount = filteredUsers.filter(user => user.gender?.toLowerCase() === 'male').length;
    const femaleCount = filteredUsers.filter(user => user.gender?.toLowerCase() === 'female').length;
    const othersCount = filteredUsers.length - (maleCount + femaleCount); // Count users who are neither male nor female

    const genderData = [
        { name: 'Male', count: maleCount },
        { name: 'Female', count: femaleCount },
        { name: 'Others', count: othersCount }
    ]
    .sort((a, b) => b.count - a.count) // Sort by count in descending order
    .reverse(); // Reverse the array to ensure the highest count is on the outside

    const GENDER_COLORS = ['#4A90E2', '#FF6F61', '#6B5B95']; // Modern color palette

    const imageUploadsPerDay = results.reduce((acc, result) => {
        if (result.image) {
            const date = result.date_saved ? new Date(result.date_saved).toLocaleDateString() : 'No Date';
            acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
    }, {});

    const imageUploadData = Object.entries(imageUploadsPerDay).map(([date, count]) => ({
        date,
        count,
    }));

    const dailyAnalysisData = results.reduce((acc, result) => {
        if (result.analysis) {
            const date = result.date_saved ? new Date(result.date_saved).toLocaleDateString() : 'No Date';
            acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
    }, {});

    const dailyAnalysisChartData = Object.entries(dailyAnalysisData).map(([date, count]) => ({
        date,
        count,
    }));

    const dailyFeedbackData = feedbacks.reduce((acc, feedback) => {
        const date = feedback.timestamp ? new Date(feedback.timestamp).toISOString().split('T')[0] : 'No Date';
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const dailyFeedbackChartData = Object.entries(dailyFeedbackData).map(([date, count]) => ({
        date,
        count,
    }));

    // Group skincare routines by date
    const skincareRoutineData = skincareRoutines.reduce((acc, routine) => {
        if (routine.created_at) {
            const date = new Date(routine.created_at).toISOString().split('T')[0]; // Ensures correct date format
            acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
    }, {});

    // Convert skincare routine data to chart format
    const skincareRoutineChartData = Object.entries(skincareRoutineData).map(([date, count]) => ({
        date,
        count,
    }));

    // Prepare user email data for Pie Chart excluding admin users
    const userEmailData = filteredUsers.map((user, index) => ({
        name: user.email || 'No Email',
        value: 1, // Each email has a value of 1
        fill: `hsl(${(index * 360) / filteredUsers.length}, 70%, 50%)`, // Generate unique colors for each email
    }));

    // Function to handle PDF generation for all charts
    const handleGeneratePDF = async () => {
        const chartsData = {
            maleCount,
            femaleCount,
            othersCount,
            imageUploadData,
            dailyFeedbackChartData,
            skincareRoutineChartData,
            medicationChartData,
            dailyAnalysisChartData,
            userEmailData,
        };
        await generatePDF(chartsData);
    };

    return (
        <div>
            <Navbar />
            <div className={styles.dashboard}>
                <div className={styles.dashboardContainer}>
                    {/* Add a button to generate the PDF */}
                    <button onClick={handleGeneratePDF} className={styles.pdfButton}>
                        Export Report as PDF
                    </button>

                    <div className={styles.chartsContainer}>
                        {/* Row 1 */}
                        <div className={styles.chartCard}>
                            <h2>Registered Users Gender Distribution</h2>
                            {maleCount === 0 && femaleCount === 0 ? (
                                <p className={styles.noData}>No gender data available</p>
                            ) : (
                                <div className="gender-chart">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RadialBarChart 
                                            innerRadius="20%" 
                                            outerRadius="80%" 
                                            data={genderData}
                                            startAngle={180} 
                                            endAngle={0}
                                        >
                                            <RadialBar 
                                                minAngle={15} 
                                                label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }} 
                                                background 
                                                dataKey="count"
                                            >
                                                {genderData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index]} />
                                                ))}
                                            </RadialBar>
                                            <Legend 
                                                iconSize={10} 
                                                width={120} 
                                                height={140} 
                                                layout="vertical" 
                                                verticalAlign="middle" 
                                                align="right" 
                                                wrapperStyle={{ fontSize: '12px' }}
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: '#333',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                }}
                                            />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                            <button onClick={() => generateGenderPDF(maleCount, femaleCount, othersCount)} className={styles.pdfButton}>
                                Export Gender Report as PDF
                            </button>
                        </div>

                        <div className={styles.chartCard}>
                            <h2>Uploaded Images Daily</h2>
                            {imageUploadData.length === 0 ? (
                                <p className={styles.noData}>No image upload data available</p>
                            ) : (
                                <div className="image-upload-chart">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={imageUploadData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                            <XAxis 
                                                dataKey="date" 
                                                tick={{ fill: '#555', fontSize: 12 }} 
                                                axisLine={{ stroke: '#ccc' }} 
                                            />
                                            <YAxis 
                                                tick={{ fill: '#555', fontSize: 12 }} 
                                                axisLine={{ stroke: '#ccc' }} 
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: '#333',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <Legend 
                                                wrapperStyle={{ fontSize: '12px' }}
                                            />
                                            <Bar 
                                                dataKey="count" 
                                                fill="#6B5B95" 
                                                radius={[5, 5, 0, 0]} 
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                            <button onClick={() => generateImageUploadPDF(imageUploadData)} className={styles.pdfButton}>
                                Export Image Upload Report as PDF
                            </button>
                        </div>

                        <div className={styles.chartCard}>
                            <h2>Daily Feedback</h2>
                            {dailyFeedbackChartData.length === 0 ? (
                                <p className={styles.noData}>No feedback data available</p>
                            ) : (
                                <div className="feedback-chart">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={dailyFeedbackChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                            <XAxis 
                                                dataKey="date" 
                                                tick={{ fill: '#555', fontSize: 12 }} 
                                                axisLine={{ stroke: '#ccc' }} 
                                            />
                                            <YAxis 
                                                tick={{ fill: '#555', fontSize: 12 }} 
                                                axisLine={{ stroke: '#ccc' }} 
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: '#333',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <Legend 
                                                wrapperStyle={{ fontSize: '12px' }}
                                            />
                                            <Bar 
                                                dataKey="count" 
                                                fill="#FF6F61" 
                                                radius={[5, 5, 0, 0]} 
                                                animationDuration={1500} 
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                            <button onClick={() => generateFeedbackPDF(dailyFeedbackChartData)} className={styles.pdfButton}>
                                Export Feedback Report as PDF
                            </button>
                        </div>

                        {/* Row 2 */}
                        <div className={styles.chartCard}>
                            <h2>Saved Skin Analysis Daily</h2>
                            {dailyAnalysisChartData.length === 0 ? (
                                <p className={styles.noData}>No analysis data available</p>
                            ) : (
                                <div className="daily-analysis-chart">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={dailyAnalysisChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                            <XAxis 
                                                dataKey="date" 
                                                tick={{ fill: '#555', fontSize: 12 }} 
                                                axisLine={{ stroke: '#ccc' }} 
                                            />
                                            <YAxis 
                                                tick={{ fill: '#555', fontSize: 12 }} 
                                                axisLine={{ stroke: '#ccc' }} 
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: '#333',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <Legend 
                                                wrapperStyle={{ fontSize: '12px' }}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="count" 
                                                stroke="#4A90E2" 
                                                strokeWidth={2} 
                                                dot={{ fill: '#4A90E2', r: 4 }} 
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                            <button onClick={() => generateDailyAnalysisPDF(dailyAnalysisChartData)} className={styles.pdfButton}>
                                Export Skin Analysis Report as PDF
                            </button>
                        </div>

                        <div className={styles.chartCard}>
                            <h2>Saved Skincare Routines Daily</h2>
                            {skincareRoutineChartData.length === 0 ? (
                                <p className={styles.noData}>No skincare routine data available</p>
                            ) : (
                                <div className="skincare-routine-chart">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={skincareRoutineChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                            <XAxis 
                                                dataKey="date" 
                                                tick={{ fill: '#555', fontSize: 12 }} 
                                                axisLine={{ stroke: '#ccc' }} 
                                            />
                                            <YAxis 
                                                tick={{ fill: '#555', fontSize: 12 }} 
                                                axisLine={{ stroke: '#ccc' }} 
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: '#333',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <Legend 
                                                wrapperStyle={{ fontSize: '12px' }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="count" 
                                                stroke="#4A90E2" 
                                                fill="#4A90E2" 
                                                fillOpacity={0.3} 
                                                stackId="1" 
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                            <button onClick={() => generateSkincareRoutinePDF(skincareRoutineChartData)} className={styles.pdfButton}>
                                Export Skincare Routine Report as PDF
                            </button>
                        </div>

                        <div className={styles.chartCard}>
                            <h2>Saved Medications Daily</h2>
                            {medicationChartData.length === 0 ? (
                                <p className={styles.noData}>No medication data available</p>
                            ) : (
                                <div className="medication-chart">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <ScatterChart
                                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                            <XAxis 
                                                dataKey="date" 
                                                name="Date" 
                                                tick={{ fill: '#555', fontSize: 12 }} 
                                                axisLine={{ stroke: '#ccc' }} 
                                            />
                                            <YAxis 
                                                dataKey="count" 
                                                name="Count" 
                                                tick={{ fill: '#555', fontSize: 12 }} 
                                                axisLine={{ stroke: '#ccc' }} 
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: '#333',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <Legend 
                                                wrapperStyle={{ fontSize: '12px' }}
                                            />
                                            <Scatter 
                                                name="Medications" 
                                                data={medicationChartData} 
                                                fill="#4A90E2" 
                                                shape="circle" 
                                            />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                            <button onClick={() => generateMedicationPDF(medicationChartData)} className={styles.pdfButton}>
                                Export Medication Report as PDF
                            </button>
                        </div>

                        {/* New User Emails Pie Chart */}
                        <div className={styles.chartCard} style={{ width: '100%' }}>
                            <h2>Registered Users</h2>
                            {userEmailData.length === 0 ? (
                                <p className={styles.noData}>No user email data available</p>
                            ) : (
                                <div className="user-email-chart" style={{ width: '100%', height: '400px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            layout="vertical" // Set layout to vertical for horizontal bars
                                            data={userEmailData}
                                            margin={{ top: 20, right: 30, left: 150, bottom: 5 }} // Adjust left margin for better label visibility
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                            <XAxis 
                                                type="number" 
                                                tick={{ fill: '#555', fontSize: 12 }} 
                                                axisLine={{ stroke: '#ccc' }} 
                                            />
                                            <YAxis 
                                                type="category" 
                                                dataKey="name" 
                                                tick={{ fill: '#555', fontSize: 12 }} 
                                                axisLine={{ stroke: '#ccc' }} 
                                                width={140} // Increase width for better email display
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: '#fff', // White background
                                                    border: '1px solid #ccc', // Light gray border
                                                    borderRadius: '5px',
                                                    color: '#333', // Dark text color
                                                    fontSize: '12px',
                                                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
                                                }}
                                                itemStyle={{
                                                    color: '#333', // Ensure item text is dark
                                                }}
                                            />
                                            <Legend 
                                                wrapperStyle={{ fontSize: '12px' }}
                                            />
                                            <Bar 
                                                dataKey="value" 
                                                fill="#8884d8" 
                                                radius={[0, 5, 5, 0]} 
                                            >
                                                {userEmailData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                            <button onClick={() => generateUserEmailPDF(userEmailData)} className={styles.pdfButton}>
                                Export User Email Report as PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;