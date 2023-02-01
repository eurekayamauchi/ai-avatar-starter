// Add useState import to top of file
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import img17 from '../assets/top_img17.png';

const Home = () => {
  // Don't retry more than 20 times
  const maxRetries = 20;
  // Create state property
  const [input, setInput] = useState('');
  // Create state property
  const [preset, setPreset] = useState('');
  // Create state property
  const [artists, setArtists] = useState('');
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

  const isActive = (val) => {
    const currentItem = preset.split(",");
    if(currentItem && currentItem.length > 0){
      for(const item of currentItem) {
        if(item && item == val){
          return true
        }
      }
      return false
    } else {
      return false
    }
  }

  const onChangeArtist = (event) => {
    setArtists(event.target.value);
  };

  const setPresets = (e) => {
    
    const val = e.currentTarget.getAttribute('data-val')
    let activeValue = false
    let resultInput = "";
    const currentItem = preset.split(",");
    if(currentItem && currentItem.length > 0){
      for(const item of currentItem) {
        if(!item){
          continue;
        }
        if(item == val){
          activeValue = true
          continue;
        }
        resultInput += `,${item}`
      }
      if(!activeValue){
        resultInput += `,${val}`
      }
      if(resultInput[0] == ','){
        resultInput = resultInput.slice(1)
      }
      setPreset(resultInput);
    } else {
      setPreset(`${val}`);
    }
  }

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

    let postData = `${input}`
    if(preset){
      postData += `, ${preset}`
    }
    if(artists){
      postData += `, by ${artists}`
    }

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ postData }),
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
            <Image src={img17} />
          </div>

          {/* Add prompt container here */}
          <div className="prompt-container">

            <input className="prompt-box" value={preset} readOnly inputProps={{ readonly: true }} placeholder='readonly. Press the button below.'/>
            
            <div className='prompts-btn-box'>
              <a 
              className={
                isActive("girl") ? 'prompts-btn selected' : 'prompts-btn'
              } data-val="girl" onClick={setPresets}>
                {/* Tweak to show a loading indicator */}
                <div className="prompts">
                  <p>girl</p>
                </div>
              </a>
              <a className={
                isActive("boy") ? 'prompts-btn selected' : 'prompts-btn'
                } data-val="boy" onClick={setPresets}>
                {/* Tweak to show a loading indicator */}
                <div className="prompts">
                  <p>boy</p>
                </div>
              </a>
              <a className={
                isActive("cyberpunk") ? 'prompts-btn selected' : 'prompts-btn'
              } data-val="cyberpunk" onClick={setPresets}>
                {/* Tweak to show a loading indicator */}
                <div className="prompts">
                  <p>cyberpunk</p>
                </div>
              </a>
              <a className={
                isActive("shadows") ? 'prompts-btn selected' : 'prompts-btn'
              } data-val="shadows" onClick={setPresets}>
                {/* Tweak to show a loading indicator */}
                <div className="prompts">
                  <p>shadows</p>
                </div>
              </a>
              <a className={
                isActive("concept art") ? 'prompts-btn selected' : 'prompts-btn'
              } data-val="concept art" onClick={setPresets}>
                {/* Tweak to show a loading indicator */}
                <div className="prompts">
                  <p>concept art</p>
                </div>
              </a>
              <a className={
                isActive("4k") ? 'prompts-btn selected' : 'prompts-btn'
              } data-val="4k" onClick={setPresets}>
                {/* Tweak to show a loading indicator */}
                <div className="prompts">
                  <p>4k</p>
                </div>
              </a>
              <a className={
                isActive("8k") ? 'prompts-btn selected' : 'prompts-btn'
              } data-val="8k" onClick={setPresets}>
                {/* Tweak to show a loading indicator */}
                <div className="prompts">
                  <p>8k</p>
                </div>
              </a>
              <a className={
                isActive("anime") ? 'prompts-btn selected' : 'prompts-btn'
              } data-val="anime" onClick={setPresets}>
                {/* Tweak to show a loading indicator */}
                <div className="prompts">
                  <p>anime</p>
                </div>
              </a>
              <a className={
                isActive("real") ? 'prompts-btn selected' : 'prompts-btn'
              } data-val="real" onClick={setPresets}>
                {/* Tweak to show a loading indicator */}
                <div className="prompts">
                  <p>real</p>
                </div>
              </a>
              <a className={
                isActive("fantasy") ? 'prompts-btn selected' : 'prompts-btn'
              } data-val="fantasy" onClick={setPresets}>
                {/* Tweak to show a loading indicator */}
                <div className="prompts">
                  <p>fantasy</p>
                </div>
              </a>
            </div>
            
            <input className="prompt-box" value={artists} onChange={onChangeArtist} placeholder='your favourite illustrators.'/>
            
            
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
