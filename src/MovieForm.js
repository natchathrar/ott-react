// src/OTTForm.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MovieForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [year, setYear] = useState('');
    const [language, setLanguage] = useState('');
    const [platform, setPlatform] = useState('');
    const [errors, setErrors] = useState({});
    const history = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            // Fetch OTT detail by ID from your API
            axios.get(`http://localhost:8000/ottdetails/${id}`)
                .then(response => {
                    const { title, description, year, language, platform } = response.data;
                    setTitle(title);
                    setDescription(description);
                    setYear(year);
                    setLanguage(language);
                    setPlatform(platform);
                })
                .catch(error => console.error('Error fetching OTT detail:', error));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple form validation
        if (!title || !description || !year || !platform || !language) {
            setErrors({ validation: 'All fields are required' });
            return;
        }

        try {
            if (id) {
                // Update OTT detail using your API with id in the URL
                const response = await axios.put(`http://localhost:8000/update/${id}`, {
                    id,
                    title,
                    description,
                    year,
                    platform,
                    language,
                });

                console.log('Updated OTT Detail:', response.data);
                toast.success('OTT Detail updated successfully');
            } else {
                // Create a new OTT detail using your API
                const response = await axios.post('http://localhost:8000/create', {
                    title,
                    description,
                    year,
                    platform,
                    language,
                });

                console.log('New OTT Detail:', response.data);
                toast.success('OTT Detail created successfully');
            }

            history('/');
        } catch (error) {
            console.error('Error updating/creating OTT detail:', error);
            setErrors({ api: 'Error updating/creating OTT detail' });
        }
    };


    return (
        <div className="container mt-3">
            <div className="row justify-content-center">
                <div className="col-md-6  bg-primary text-white rounded p-4">
                    <h2>{id ? 'Edit' : 'Create'} OTT Detail</h2>
                    {errors.validation && (
                        <div className="alert alert-danger" role="alert">
                            {errors.validation}
                        </div>
                    )}
                    {errors.api && (
                        <div className="alert alert-danger" role="alert">
                            {errors.api}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="form-label">Movie:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Description:</label>
                            <textarea
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Release Year:</label>
                            <input
                                type="number"
                                className="form-control"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Platform:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Language:</label>
                            <select
                                className="form-select"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option value="">Select Language</option>
                                <option value="English">English</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Malayalam">Malayalam</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-warning" style={{ float: 'right' }}>
                            {id ? 'Update' : 'Create'} OTT Detail
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default MovieForm;
