import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssetList = () => {
    const [assets, setAssets] = useState([]);
    const [newAsset, setNewAsset] = useState({ name: '', allocation: '' });

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const response = await axios.get('/api/assets');
            setAssets(response.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    const addAsset = async () => {
        try {
            const response = await axios.post('/api/assets', newAsset);
            setAssets([...assets, response.data]);
            setNewAsset({ name: '', allocation: '' });
        } catch (error) {
            console.error('Error adding asset:', error);
        }
    };

    const deleteAsset = async (id) => {
        try {
            await axios.delete(`/api/assets/${id}`);
            setAssets(assets.filter(asset => asset.id !== id));
        } catch (error) {
            console.error('Error deleting asset:', error);
        }
    };

    return (
        <div>
            <h2>Asset List</h2>
            <ul>
                {assets.map(asset => (
                    <li key={asset.id}>
                        {asset.name} - Allocation: {asset.allocation}%
                        <button onClick={() => deleteAsset(asset.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <h3>Add New Asset</h3>
            <input
                type="text"
                placeholder="Asset Name"
                value={newAsset.name}
                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
            />
            <input
                type="number"
                placeholder="Allocation Percentage"
                value={newAsset.allocation}
                onChange={(e) => setNewAsset({ ...newAsset, allocation: e.target.value })}
            />
            <button onClick={addAsset}>Add Asset</button>
        </div>
    );
};

export default AssetList;