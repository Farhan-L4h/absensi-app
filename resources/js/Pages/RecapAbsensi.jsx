import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RecapAbsensi() {
    const [recap, setRecap] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/rekap/data')
            .then(res => {
                setRecap(res.data.recap);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching recap:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Rekap Absensi Saya</h1>
            <table className="w-2/3 shadow bg-white border border-gray-200">
                <thead>
                    <tr>
                        {['Tanggal', 'Hari', 'Status', 'Jam'].map((header, index) => (
                            <th key={index} className="px-4 py-2 text-left border-b">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {recap.map((r, i) => (
                        <tr
                            key={i}
                            className={i % 2 === 0 ? 'bg-gray-100 hover:bg-gray-200' : 'hover:bg-gray-200'}
                        >
                            {['tanggal', 'hari', 'status', 'jam'].map((field, index) => (
                                <td key={index} className="px-4 py-2 border-b">
                                    {r[field]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
