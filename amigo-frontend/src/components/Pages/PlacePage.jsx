import React, { useEffect, useState } from 'react'
import { useGlobalState } from '../state'
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import styles from './css/PlacePage.module.css'

const urlBase = "http://localhost:8080/";

const PlacePage = () => {
    const [defaultEmail] = useGlobalState("email");
    const { placeIdParm} = useParams();
    const [ currentPlace, setCurrentPlace] = useState(null);
    const [ currentPosts, setCurrentPosts] = useState([]);

    const fetchData = async () => {
        const place = await getPlaceByPlaceId(placeIdParm);
        setCurrentPlace(place);
        const postMentionedCurrentPlace = await getPostByPlaceId(placeIdParm);
        setCurrentPosts(postMentionedCurrentPlace);
    }

    useEffect(() => {
        fetchData();
    })
    return (
        <div>
            {defaultEmail?
                <div className={styles.parentContainer}>
                    <Navbar/>
                    <div className={styles.topContainer}>
                        {currentPlace?
                            <h1 className={styles.highlight}>
                                <span>{currentPlace.placeName},</span> 
                                {' County: '}
                                <span>{currentPlace.county},</span>
                                {' Check-ins: '}
                                <span>{currentPlace.mentionsNumber}</span>
                            </h1>
                        :
                        null
                        }
                    </div>
                    <div className={styles.galleryContainer}>
                    {currentPosts ? currentPosts.map((post, index) => (
                        post.urlImgPost ?
                            <div key={index} className={styles.postCard}>
                                <div className={styles.middleRow}>
                                    <img src={post.urlImgPost} alt="Post" />
                                </div>
                            </div>
                        :
                        null
                    )) :
                        <p>No photos to display!</p>
                    }
                    </div>
                </div>
            :
            <div>
                <Navbar/>
                <p>You are not connected</p>
            </div>
            }
        </div>
    )
}

const getPlaceByPlaceId = async (place_id) => {
    try {
        const response3 = await fetch(urlBase + "place/getPlaceByPlaceId", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(place_id)
        });
    
        if (!response3.ok) {
            throw new Error(`HTTP error! status: ${response3.status}`);
        }
        const data = await response3.json();
        return data;
    } catch(error) {
        console.log("Error get place by place_id");
        return null;
    }
}

const getPostByPlaceId = async (place_id) => {
    try {
        const response3 = await fetch(urlBase + "place/getPostByPlaceId", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(place_id)
        });
    
        if (!response3.ok) {
            throw new Error(`HTTP error! status: ${response3.status}`);
        }
        const data = await response3.json();
        return data;
    } catch(error) {
        console.log("Error get place by place_id");
        return [];
    }
}

export default { PlacePage, getPlaceByPlaceId, getPostByPlaceId}
