import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, Terminal, Bot, Upload, Image as ImageIcon, X, Loader2, ExternalLink, PlayCircle } from 'lucide-react';
import './Hero.css';

interface SearchResult {
  platform: string;
  title: string;
  url: string;
}

interface AnalysisResponse {
  status: string;
  extracted_text: string;
  social_results: SearchResult[];
}

export const Hero: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setFileObject(file);
      setError(null);
      setAnalysisData(null);
    }
  };

  const handleRunAnalysis = async () => {
    if (!fileObject) return;

    setLoading(true);
    setAnalysisData(null);
    setError(null);

    const formData = new FormData();
    formData.append('image', fileObject);

    try {
      const response = await fetch('http://localhost:8080/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data: AnalysisResponse = await response.json();
      setAnalysisData(data);
    } catch (err: any) {
      console.error('Analysis Request Failed:', err);
      setError('Failed to analyze the image. Please make sure Python FastAPI server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFileObject(null);
    setAnalysisData(null);
    setError(null);
  };

  return (
    <section className="lookup-hero">
      <div className="lookup-hero-glow-1"></div>

      <div className="lookup-hero-container">
        
        <div className="lookup-hero-badge">
          <span className="lookup-hero-badge-dot"></span>
          LookUp AI v2.0 (DeepFace AI) is live
          <span className="text-zinc-500">|</span>
          <span className="text-indigo-400 hover:underline cursor-pointer flex items-center gap-1">
            Explore updates <ArrowRight style={{ width: '12px', height: '12px' }} />
          </span>
        </div>

        <h1 className="lookup-hero-title">
          AI-Powered Face & Profile Search Engine for <span className="lookup-hero-title-gradient">Matching People</span>
        </h1>

        <p className="lookup-hero-subtitle">
          Upload a person's photo to analyze facial features using AI and instantly find matching profiles across social media platforms.
        </p>

        <div className="lookup-hero-actions">
          <a href="#get-started" className="lookup-hero-btn-primary">
            Start Free Now
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </a>
          <a href="#demo" className="lookup-hero-btn-secondary">
            <Play style={{ width: '14px', height: '14px', fill: 'currentColor' }} />
            Watch Demo
          </a>
        </div>

        <div className="lookup-hero-preview">
          <div className="lookup-hero-preview-inner">
            <div className="lookup-hero-preview-header">
              <div className="lookup-hero-preview-dots">
                <span className="lookup-hero-preview-dot"></span>
                <span className="lookup-hero-preview-dot"></span>
                <span className="lookup-hero-preview-dot"></span>
              </div>
              <span className="lookup-hero-preview-title">lookup-facial-ai.py</span>
              <Terminal style={{ width: '16px', height: '16px', color: '#71717a' }} />
            </div>

            <div className="lookup-hero-preview-content">
              <div className="flex flex-col gap-3">
                <div className="lookup-image-upload-container">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <ImageIcon style={{ width: '16px', height: '16px', color: '#6366f1' }} />
                    <span>{selectedImage ? "Target face image attached" : "Upload person's face photo for analysis:"}</span>
                  </div>
                  <label className="lookup-file-input-label">
                    <Upload style={{ width: '12px', height: '12px' }} />
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="lookup-file-input"
                    />
                  </label>
                </div>

                {selectedImage && !analysisData && !loading && (
                  <button
                    onClick={handleRunAnalysis}
                    className="lookup-run-btn"
                  >
                    <PlayCircle style={{ width: '18px', height: '18px' }} />
                    Run AI Facial Analysis & Search
                  </button>
                )}
              </div>

              {selectedImage && (
                <div className="lookup-hero-image-wrapper">
                  <button onClick={handleRemoveImage} className="lookup-image-remove-btn" title="Remove image">
                    <X style={{ width: '14px', height: '14px' }} />
                  </button>
                  <img
                    src={selectedImage}
                    alt="Uploaded Target Face Preview"
                    className="lookup-hero-image"
                  />
                </div>
              )}

              <div className="lookup-hero-prompt-box">
                <div className="lookup-hero-prompt-text">
                  <span className="text-indigo-600 font-mono text-xs">ai-agent &gt;</span>
                  <span>
                    {fileObject 
                      ? `POST /api/analyze (${fileObject.name}) [DeepFace Engine]` 
                      : "Extracting facial features, age, gender and matching social profiles..."}
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-mono">
                  {loading ? "Analyzing face..." : "Ready"}
                </span>
              </div>

              {error && (
                <div className="p-3 text-xs text-red-600 bg-red-500/10 border border-red-500/20 rounded-xl">
                  {error}
                </div>
              )}

              <div className="lookup-hero-response-box">
                <div className="flex items-center gap-2 mb-2 text-indigo-600 text-xs font-semibold">
                  <Bot style={{ width: '14px', height: '14px' }} />
                  LookUp AI Analysis:
                </div>

                {loading ? (
                  <div className="flex items-center gap-2 text-zinc-500 text-sm py-2">
                    <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin text-indigo-600" />
                    <span>Analyzing facial attributes via Python DeepFace backend...</span>
                  </div>
                ) : analysisData ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm">
                      <strong>AI Detection:</strong> {analysisData.extracted_text}
                    </p>
                    
                    {analysisData.social_results.length > 0 && (
                      <div className="flex flex-col gap-2 mt-1">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                          Social Media & Profile Match Results:
                        </span>
                        <div className="grid gap-2">
                          {analysisData.social_results.map((res, idx) => (
                            <a
                              key={idx}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs hover:border-indigo-500 transition-colors"
                            >
                              <span className="font-semibold text-indigo-600">{res.platform}</span>
                              <span className="text-zinc-700 truncate max-w-xs">{res.title}</span>
                              <ExternalLink style={{ width: '12px', height: '12px' }} className="text-zinc-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm">
                    Facial feature extraction system ready. Upload a photograph above to trigger deep learning analysis and discover matching digital footprints.
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};