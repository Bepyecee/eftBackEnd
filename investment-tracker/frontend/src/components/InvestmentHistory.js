import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InvestmentHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchInvestmentHistory();
    }, []);

    const fetchInvestmentHistory = async () => {
        try {
            const response = await axios.get('/api/investment-history');
            setHistory(response.data);
        } catch (error) {
            console.error('Error fetching investment history:', error);
        }
    };

    return (
        <div>
            <h2>Investment History</h2>
            <ul>
                {history.map(record => (
                    <li key={record.id}>
                        {record.date} - {record.assetName}: ${record.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InvestmentHistory;