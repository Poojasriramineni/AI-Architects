import React, { useState, useEffect } from 'react';
import styled from "styled-components";

const API_TOKEN = "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";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
  font-size: 80px;
`;

const Description = styled.p`
  margin-bottom: 1rem;
`;

const GenForm = styled.form`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Loading = styled.div`
  margin-top: 1rem;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const ImageGenerationForm = () => {
    const [loading, setLoading] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState(null);
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setAudioURL(null); // Clear previous audio
        setError(null); // Clear previous error
      
        try {
          const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/fastspeech2-en-ljspeech",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_TOKEN}`,
              },
              body: JSON.stringify({ inputs: inputValue }), // Send only the input value
            }
          );
      
          if (!response.ok) {
            throw new Error("Failed to generate audio");
          }
      
          const blob = await response.blob();
          setAudioURL(URL.createObjectURL(blob));
          setLoading(false);
        } catch (error) {
          console.error("Failed to generate audio:", error);
          setError("Failed to generate audio. Please try again.");
          setLoading(false);
        }
      };
      
  
    useEffect(() => {
      return () => {
        if (audioURL) {
          URL.revokeObjectURL(audioURL);
        }
      };
    }, [audioURL]);
  
    return (
        <Container>
          <Title>Text-to-Audio</Title>
          <Description>
            React Application utilizing the Huggingface API for Text-to-Audio Conversion
          </Description>
          <GenForm onSubmit={handleSubmit}>
            <Input
              type="text"
              name="input"
              placeholder="Type your text here..."
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </GenForm>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {loading && <Loading>Loading...</Loading>} 
          {audioURL && (
            <audio controls>
              <source src={audioURL} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </Container>
      );
    };
  
  export default ImageGenerationForm;
