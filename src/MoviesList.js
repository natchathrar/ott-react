// src/OTTList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Table, Input, Button, Space, Popconfirm } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function MoviesList() {
    const [ottData, setOTTData] = useState([]);

    useEffect(() => {
        fetchOTTData();
    }, []);

    const fetchOTTData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/getAll');
            setOTTData(response.data.ottdetails);
            toast.success(response.data.message)
        } catch (error) {
            console.error('Error fetching OTT data:', error);
        }
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
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            ...getColumnSearchProps('title', 'Search Title'),
        },
        {
            title: 'Release Date',
            dataIndex: 'year',
            key: 'year',
            sorter: (a, b) => new Date(a.released) - new Date(b.released),
            ...getColumnSearchProps('year', 'Search Release Date'),
        },
        {
            title: 'Platform',
            dataIndex: 'platform',
            key: 'platform',
            sorter: (a, b) => a.platform.localeCompare(b.platform),
            ...getColumnSearchProps('platform', 'Search Platform'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Link to={`/create/${record._id}`}>
                        <Button type="primary" icon={<EditOutlined />} title="Edit" />
                    </Link>
                    <Popconfirm
                        title="Are you sure to delete this OTT detail?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className='btn-danger' icon={<DeleteOutlined />} title="Delete" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/delete/${id}`);
            fetchOTTData();
        } catch (error) {
            console.error('Error deleting OTT detail:', error);
        }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = (clearFilters) => {
        clearFilters();
    };



    return (
        <div>
            <div className="container p-5">
                <h3 className="text-center mb-4">
                    <i className="bx bx-camera-movie fs-1" style={{ color: '#fc0808' }}></i> My movies details
                </h3>
                <Space style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={fetchOTTData}>
                        Get All
                    </Button>
                    <Link to="/create">
                        <Button type="primary">Create New OTT Detail</Button>
                    </Link>
                </Space>
                <Table
                    columns={columns}
                    dataSource={ottData}
                    pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
                />
            </div>
            <ToastContainer />
        </div>
    );
}

export default MoviesList;
