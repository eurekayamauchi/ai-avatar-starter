

const bufferToBase64 = (buffer) => {
    let arr = new Uint8Array(buffer);
    const base64 = btoa(
      arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
    return `data:image/png;base64,${base64}`;
};

const generateAction = async (req, res) => {
    console.log('Received request. ' + req.body );

    const input = JSON.parse(req.body).postData;

    const finalInput = input.replace(/raza/gi, 'abraza');

    console.log('here. input: ' + input);
  
    const response = await fetch(
      `https://api-inference.huggingface.co/models/gourmegul/sd-1-5-2-tyamauchi`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
          'Content-Type': 'application/json',
          'x-use-cache': 'false'
        },
        method: 'POST',
        body: JSON.stringify({
            input: finalInput
        }),
      }
    );
  
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      // Convert to base64
      const base64 = bufferToBase64(buffer);
      // Make sure to change to base64
      res.status(200).json({ image: base64 });
    } else if (response.status === 503) {
      const json = await response.json();
      res.status(503).json(json);
    } else {
      const json = await response.json();
      res.status(response.status).json({ error: response.statusText });
    }
};

export default generateAction;