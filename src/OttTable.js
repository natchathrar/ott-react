import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function OTTTable() {
    const [ottData, setOTTData] = useState([]);
    // const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOTTData();
    }, []);

    const fetchOTTData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/rapidapidetails');
            setOTTData(response.data.results);
        } catch (error) {
            console.error('Error fetching OTT data:', error);
        }
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Release Date',
            dataIndex: 'released',
            key: 'released',
            sorter: (a, b) => new Date(a.released) - new Date(b.released),
        },
        {
            title: 'Rating',
            dataIndex: 'imdbrating',
            key: 'imdbrating',
            sorter: (a, b) => a.imdbrating - b.imdbrating,
        },
    ];

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchTerm(selectedKeys[0]);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchTerm('');
    };

    const getColumnSearchProps = (dataIndex, placeholder) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={placeholder}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    });

    return (
        <div className='container p-5'>
            <h3 className='text-center mb-4'><i class='bx bx-camera-movie fs-1' style={{ color: '#fc0808' }} ></i> OTT movies details</h3>
            <Table
                columns={columns.map((col) => ({
                    ...col,
                    ...getColumnSearchProps(col.dataIndex, `Search ${col.title}`),
                }))}
                dataSource={ottData}
                pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
            />
        </div>
    );
}

export default OTTTable;
