import React, { useState, useEffect } from 'react';

const ImageCaptcha = ({ onVerify }) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [captchaText, setCaptchaText] = useState('');
    const [resultMessage, setResultMessage] = useState('');

    const imageSets = [
        {
            name: 'Duck',
            images: ['duck1.jpeg', 'duck2.jpeg', 'duck4.jpeg']
        },
        {
            name: 'Cat',
            images: ['cat1.jpeg', 'cat2.jpeg', 'cat4.jpeg']
        },
        {
            name: 'Fish',
            images: ['fish1.jpg', 'fish2.jpg', 'fish3.jpg', 'fish4.jpg']
        },
        {
            name: 'Dog',
            images: ['dog1.jpg', 'dog2.jpg', 'dog3.jpg']
        },
        {
            name: 'Horse',
            images: ['horse1.jpg', 'horse2.jpg']
        }
    ];

    useEffect(() => {
        renderCaptcha();
    }, []); // Run only once on component mount

    const getRandomSet = () => {
        return imageSets[Math.floor(Math.random() * imageSets.length)];
    };

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const getRandomInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const renderCaptcha = () => {
        const selectedSet = getRandomSet();
        const allImages = selectedSet.images;
        const correctImages = allImages.filter(image => image !== '');

        const noiseImagesCount = 8 - correctImages.length;
        const noiseImages = [];
        for (let i = 0; i < noiseImagesCount; i++) {
            const rand = getRandomInteger(1, 20);
            const randomImage = 'random' + rand + '.jpg'; // Example random image name
            noiseImages.push(randomImage);
        }

        const displayedImages = correctImages.concat(noiseImages);
        shuffle(displayedImages);

        setCaptchaText(`Please select all images containing ${selectedSet.name.toLowerCase()}s:`);

        setSelectedImages(displayedImages.map(imageUrl => ({
            url: 'http://localhost:3000/capcha/' + imageUrl,
            correct: correctImages.includes(imageUrl),
            selected: false
        })));
    };

    const toggleSelection = (index) => {
        const updatedImages = [...selectedImages];
        updatedImages[index].selected = !updatedImages[index].selected;
        setSelectedImages(updatedImages);
    };

    const validateCaptcha = () => {
        const selectedCorrect = selectedImages.every(img => img.selected === img.correct);
        const selectedIncorrect = selectedImages.some(img => img.selected && !img.correct);

        if (selectedCorrect && !selectedIncorrect && selectedImages.filter(img => img.correct).length === selectedImages.filter(img => img.selected).length) {
            setResultMessage('CAPTCHA solved successfully! You are human.');
            onVerify(true); // Notify parent component about success
        } else {
            setResultMessage('CAPTCHA verification failed! Please try again.');
            onVerify(false); // Notify parent component about failure
            renderCaptcha();
        }
    };

    return (
        <div className="captcha-container flex justify-center">
            <div className="card max-w-screen-md p-8 bg-white border border-gray-300 rounded-lg grid grid-cols-2 gap-4">
                <div className="top col-span-2">
                    <h2 className="text-xl font-semibold">Verify you're human</h2>
                    <p className="text-sm">{captchaText}</p>
                </div>
                <div id="captcha" className="col-span-2 grid grid-cols-2 gap-4">
                    {selectedImages.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={`Image ${index}`}
                            className={`rounded-lg cursor-pointer border-2 transition duration-300 ease-in-out transform hover:scale-105 ${image.selected ? 'border-green-500' : 'border-transparent'}`}
                            style={{ objectFit: 'cover', width: '100%', height: '100px' }}
                            onClick={() => toggleSelection(index)}
                        />
                    ))}
                </div>
                <div className="col-span-2 flex justify-center">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={validateCaptcha}>Submit</button>
                </div>
                <div className="col-span-2 text-center">
                    <p className={`text-sm ${resultMessage.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>{resultMessage}</p>
                </div>
            </div>
        </div>
    );
};

export default ImageCaptcha;
