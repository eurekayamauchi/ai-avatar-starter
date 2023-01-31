// Add useState import to top of file
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import img1 from '../assets/top_img1.png';
import img2 from '../assets/top_img2.png';
import img3 from '../assets/top_img3.png';
import img4 from '../assets/top_img4.png';
import img5 from '../assets/top_img5.png';
import img6 from '../assets/top_img6.png';
import img7 from '../assets/top_img7.png';
import img8 from '../assets/top_img8.png';
import img9 from '../assets/top_img9.png';
import img10 from '../assets/top_img10.png';
import img11 from '../assets/top_img11.png';
import img12 from '../assets/top_img12.png';
import img13 from '../assets/top_img13.png';
import img14 from '../assets/top_img14.png';
import img15 from '../assets/top_img15.png';
import img16 from '../assets/top_img16.png';

const Home = () => {
  // Don't retry more than 20 times
  const maxRetries = 20;
  // Create state property
  const [input, setInput] = useState('');
  // Create new state property
  const [img, setImg] = useState('');
  // Numbers of retries 
  const [retry, setRetry] = useState(0);
  // Number of retries left
  const [retryCount, setRetryCount] = useState(maxRetries);
  // Add isGenerating state
  const [isGenerating, setIsGenerating] = useState(false);
  // Add new state here
  const [finalPrompt, setFinalPrompt] = useState('');
  // Add this function
  const onChange = (event) => {
    setInput(event.target.value);
  };
  const generateAction = async () => {
    console.log('Generating...');

    if (isGenerating && retry === 0) return;

    setIsGenerating(true);

    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();

    if (response.status === 503) {
      setRetry(data.estimated_time);
      return;
    }

    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      setIsGenerating(false);
      return;
    }

    // Set final prompt here
    setFinalPrompt(input);
    // Remove content from input box
    setInput('');
    setImg(data.image);
    setIsGenerating(false);
  };

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };
  
  // Add useEffect here
  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`);
        setRetryCount(maxRetries);
        return;
        }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);

  return (
    <div className="root">
      <Head>
        <title>AI Avatar Generator | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Am I cool?</h1>
          </div>
          <div className="subtitle">
            <p>
              Someone in the image below is me. Am I cool??
            </p>
            <p>
              Try typing my name in the form below! Then you'll know it's true.
            </p>
            <p>
              My name is "Orlando Bloom". Thank you!
            </p>
          </div>
          
          <div className="center">
            <Image src={img1} />
            <Image src={img2} />
            <Image src={img3} />
            <Image src={img4} />
            <Image src={img5} />
            <Image src={img6} />
            <Image src={img7} />
            <Image src={img8} />
            <Image src={img9} />
            <Image src={img10} />
            <Image src={img11} />
            <Image src={img12} />
            <Image src={img13} />
            <Image src={img14} />
            <Image src={img15} />
            <Image src={img16} />
          </div>

          {/* Add prompt container here */}
          <div className="prompt-container">

            <a className="prompts-btn" onClick={generateAction}>
              {/* Tweak to show a loading indicator */}
              <div className="prompts">
                <p></p>
              </div>
            </a>
            <input className="prompt-box" value={input} onChange={onChange} placeholder='pls input "Orlando Bloom"'/>
            {/* Add your prompt button in the prompt container */}
            <div className="prompt-buttons">
              {/* Tweak classNames to change classes */}
              <a
                className={
                  isGenerating ? 'generate-button loading' : 'generate-button'
                }
                onClick={generateAction}
              >
                {/* Tweak to show a loading indicator */}
                <div className="generate">
                  {isGenerating ? (
                    <span className="loader"></span>
                  ) : (
                    <p>Generate</p>
                  )}
                </div>
              </a>
            </div>
          </div>          
        </div>
        {/* Add output container */}
        {img && (
          <div className="output-content">
            <Image src={img} width={512} height={512} alt={input} />
          </div>
        )}
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-avatar"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
