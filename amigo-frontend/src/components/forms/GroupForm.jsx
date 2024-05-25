import React, { useState } from 'react';
import { useGlobalState } from '../state';
import Auth from '../auth/Auth';
import styles from './css/GroupForm.module.css';
import addGroupImg from '../Assets/groupIcon.png';

const urlBase = "http://localhost:8080/";

const GroupForm = () => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [defaultEmail] = useGlobalState("email");
    const [access, setAccess] = useState("public");
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let creator_id = await Auth.getIdByEmail(defaultEmail);
        const group = { creator_id, urlImg: image, name, access };
        console.log(group);
        try {
            let response = await fetch(urlBase + "group/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(group)
            });

            if (!response.ok) {
                throw new Error('Failed to save group');
            }

            let current_group_create;
            try {
                current_group_create = await response.json();
                console.log("Group created:", current_group_create);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }

            const response2 = await fetch(`${urlBase}group/CREATE`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ creator_id, group_id: current_group_create.group_id }),
            });

            if (!response2.ok) {
                throw new Error(`HTTP error! status: ${response2.status}`);
            }

            const response3 = await fetch(`${urlBase}group/MEMBERSHIP`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ account_id: creator_id, group_id: current_group_create.group_id }),
            });

            if (!response3.ok) {
                throw new Error(`HTTP error! status: ${response3.status}`);
            }

            setImage(null);
            setName('');
            setAccess('public');
            setShowForm(false);

            console.log('Group saved successfully');
        } catch (error) {
            console.error('Error saving group:', error.message);
        }
    };

    const convertImgBase64 = (e) => {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setImage(reader.result);
        }
    }

    const handleCreateGroupClick = () => {
        setShowForm(true);
    }

    const handleCancelClick = () => {
        setShowForm(false);
    }

    return (
        <div className={styles.groupFormMainContainer}>
            {!showForm && (
                <div className={styles.createGroupButton} onClick={handleCreateGroupClick}>
                    Create Group
                </div>
            )}
            {showForm && (
                <div className={styles.groupFormContainer}>
                    <h2>Create a Group</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Group Name:</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter group name"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="image">
                                <img src={addGroupImg} alt="Add Group" />
                            </label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={convertImgBase64}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="access">Access:</label>
                            <select
                                id="access"
                                value={access}
                                onChange={(e) => setAccess(e.target.value)}
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                        <div
                            className={`${styles.submitText} ${name && image ? styles.enabled : ''}`}
                            onClick={name && image ? handleSubmit : null}
                        >
                            Create Group
                        </div>
                        <div className={styles.cancelText} onClick={handleCancelClick}>
                            Cancel
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
    
}

export default GroupForm;
