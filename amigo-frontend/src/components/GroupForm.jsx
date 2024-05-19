import React from 'react'
import { useState } from 'react';
import { useGlobalState } from './state';
import Auth from './auth/Auth';
import Group from './Pages/Group';
import Navbar from './Navbar';

const urlBase = "http://localhost:8080/";

const GroupForm = () => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [defaultEmail] = useGlobalState("email");
    const [access, setAccess] = useState("public");
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let creator_id =await Auth.getIdByEmail(defaultEmail);
        const group = {creator_id, urlImg:image, name, access}
        console.log(group);
        try {
          let response = await fetch(urlBase + "group/add", {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify(group)
          });
      
          if (!response.ok) {
              throw new Error('Failed to save group');
          }
          
          let current_group_create
          try {
            current_group_create = await response.json(); // Aici obții id-ul grupului din răspunsul primit de la backend
            console.log("Group created:", current_group_create);
          } catch (error) {
              console.error('Error parsing JSON:', error);
          } // Aici obții id-ul grupului din răspunsul primit de la backend  
          
          const response2 = await fetch(`${urlBase}group/CREATE`, {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ creator_id, group_id:current_group_create.group_id}),
          });

          if (!response2.ok) {
              throw new Error(`HTTP error! status: ${response2.status}`);
          }

          const response3 = await fetch(`${urlBase}group/MEMBERSHIP`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({account_id:creator_id, group_id:current_group_create.group_id}),
        });

        if (!response3.ok) {
            throw new Error(`HTTP error! status: ${response3.status}`);
        }
        
            // Resetăm valorile câmpurilor
            setImage(null);
            setName('');
            setAccess('');
        
            // Afișăm un mesaj de succes sau redirecționăm utilizatorul
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
      
  
    return (
      <div>
        <h2>Create a Group</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="content">Name:</label>
            <textarea
              id="content"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={convertImgBase64}
              required
            />
          </div>
          <div>
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
          <button type="submit">Submit</button>
        </form>
      </div>
    );
}

export default GroupForm
