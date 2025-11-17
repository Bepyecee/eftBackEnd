import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EtfList = () => {
    const [etfs, setEtfs] = useState([]);

    useEffect(() => {
        fetchEtfs();
    }, []);

    const fetchEtfs = async () => {
        try {
            const response = await axios.get('/api/etfs');
            setEtfs(response.data);
        } catch (error) {
            console.error('Error fetching ETFs:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/etfs/${id}`);
            setEtfs(etfs.filter(etf => etf.id !== id));
        } catch (error) {
            console.error('Error deleting ETF:', error);
        }
    };

    return (
        <div>
            <h2>ETF List</h2>
            <ul>
                {etfs.map(etf => (
                    <li key={etf.id}>
                        {etf.name} - Current Value: ${etf.currentValue}
                        <button onClick={() => handleDelete(etf.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EtfList;