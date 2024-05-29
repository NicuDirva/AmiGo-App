import React, { useState, useEffect } from 'react';
import { useGlobalState } from './state';
import Auth from './auth/Auth';
import styles from './css/PlaceMention.module.css';
import mentionIcon from './Assets/placeholder_9262403.png'; // Asigură-te că calea către imagine este corectă

const urlBase = "http://localhost:8080/";

const PlaceMention = ({ createPlaceMention, resetMentionForm }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [county, setCounty] = useState('No location selected');
    const [currentAccountId, setCurrentAccountId] = useState(null);
    const [defaultEmail] = useGlobalState("email");
    const [placeFoundByCounty, setPlaceFoundByCounty] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [ isMessageVisible, setIsMessageVisible] = useState(false);

    const judete = [
        "ALBA", "ARAD", "ARGES", "BACAU", "BIHOR", "BISTRITA-NASAUD", "BOTOSANI",
        "BRASOV", "BRAILA", "BUZAU", "CARAS-SEVERIN", "CALARASI", "CLUJ", "CONSTANTA",
        "COVASNA", "DAMBOVITA", "DOLJ", "GALATI", "GIURGIU", "GORJ", "HARGHITA", "HUNEDOARA",
        "IALOMITA", "IASI", "ILFOV", "MARAMURES", "MEHEDINTI", "MURES", "NEAMT", "OLT", "PRAHOVA",
        "SATU MARE", "SALAJ", "SIBIU", "SUCEAVA", "TELEORMAN", "TIMIS", "TULCEA", "VASLUI",
        "VALCEA", "VRANCEA", "BUCURESTI"
    ];

    useEffect(() => {
        if(resetMentionForm) {
            resetForms();
        }
        fetchData();
    }, [resetMentionForm]);

    const fetchData = () => {
        const currentId = Auth.getIdByEmail(defaultEmail);
        setCurrentAccountId(currentId);
    }

    const handleLocationChange = async (e) => {
        const selectedLocation = e.target.value;
        setCounty(selectedLocation);
        try {
            const response = await fetch(urlBase + "place/getPlaceByCounty", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedLocation)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPlaceFoundByCounty(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleSubmit = async () => {
        let currentPlace = null;
        if (placeFoundByCounty.length) {
            for (const place of placeFoundByCounty) {
                if (place.placeName.toLowerCase() === searchTerm.toLowerCase()) {
                    currentPlace = place;
                }
            }
        }
        if (currentPlace) {
            await accountMentionedPlace(currentPlace.place_id);
            createPlaceMention(currentPlace.place_id);
            setConfirmationMessage(
                <>
                    You have mentioned <strong>{currentPlace.placeName}</strong> from <strong>{county}</strong>.
                </>
            );
        } else {
            let place = { county, placeName: searchTerm, mentionsNumber: 1 };

            let response = await fetch(urlBase + "place/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(place)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let current_place_create;
            try {
                current_place_create = await response.json();
                setConfirmationMessage(`You have mentioned ${current_place_create.placeName} from ${county}.`);
                createPlaceMention(current_place_create.place_id);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
        setIsFormVisible(false);
        setIsMessageVisible(true);
    }

    const handleIconClick = () => {
        setIsFormVisible(!isFormVisible);
        if (isFormVisible) {
            setSearchTerm('');
            setCounty('No location selected');
            setPlaceFoundByCounty([]);
            setConfirmationMessage('');
        }
    }

    const resetForms = () => {
        setIsFormVisible(false);
        setSearchTerm('');
        setCounty('No location selected');
        setPlaceFoundByCounty([]);
        setConfirmationMessage('');
        setIsMessageVisible(false);
    }

    const filteredSuggestions = placeFoundByCounty.filter(place =>
        place.placeName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.placeMentionContainer}>
            {!isMessageVisible ?
                <img src={mentionIcon} alt="Mention Place" onClick={() => handleIconClick()} className={styles.mentionIcon} />
            :null
            }
            {isFormVisible && (
                <div>
                    <div className={styles.placeMention}>
                        <form>
                            <div onChange={handleLocationChange}>
                                <select name="location" defaultValue={county} className={styles.select}>
                                    <option value="">Select County</option>
                                    {judete.map((judet, index) => (
                                        <option key={index} value={judet}>{judet}</option>
                                    ))}
                                </select>
                            </div>

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Mention a place"
                                className={styles.input}
                            />
                            {filteredSuggestions.length > 0 && (
                                <ul className={styles.suggestions}>
                                    {filteredSuggestions.map((place) => (
                                        <li key={place.id} onClick={() => setSearchTerm(place.placeName)} className={styles.suggestionItem}>
                                            {place.placeName}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div
                                className={`${styles.submitText} ${searchTerm && county !== 'No location selected' ? styles.enabled : ''}`}
                                onClick={searchTerm ? handleSubmit : null}
                            >
                                Submit
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {confirmationMessage && isMessageVisible && (
                <div className={styles.confirmationMessage}>
                    {confirmationMessage}
                </div>
            )}
        </div>
    );
};

const createAccountVisitPlaceRelationship = async (post_id, place_id) => {
    let response = await fetch(urlBase + "place/createAccountVisitPlaceRelationship", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id, place_id })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}

const accountMentionedPlace = async (place_id) => {
    let response = await fetch(urlBase + "place/accountMentionedPlace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(place_id)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}

const getPlacesByCounty = async (county) => {
    try {
        const response = await fetch(urlBase + "place/getPlaceByCounty", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(county)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
export default { PlaceMention, createAccountVisitPlaceRelationship, accountMentionedPlace, getPlacesByCounty };
