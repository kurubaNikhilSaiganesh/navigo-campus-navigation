// QRScanner — camera-based QR code scanner using jsQR
// Falls back gracefully to manual entry when camera is unavailable

import { useEffect, useRef, useState, useCallback } from 'react';
import { parseQRPayload } from '../lib/qr';

const STATE = {
  IDLE:         'idle',
  REQUESTING:   'requesting',
  SCANNING:     'scanning',
  SUCCESS:      'success',
  ERROR:        'error',
  NO_CAMERA:    'no_camera',
  NO_SUPPORT:   'no_support',
};

export default function QRScanner({ onResult, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const [scanState, setScanState] = useState(STATE.IDLE);
  const [error, setError] = useState('');
  const [manualInput, setManualInput] = useState('');

  // Cleanup stream on unmount
  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const startScanning = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setScanState(STATE.NO_SUPPORT);
      return;
    }

    setScanState(STATE.REQUESTING);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanState(STATE.SCANNING);
      scheduleScan();
    } catch (err) {
      const msg = err.name === 'NotAllowedError'
        ? 'Camera permission denied. Please allow camera access and try again.'
        : err.name === 'NotFoundError'
        ? 'No camera found on this device.'
        : `Camera error: ${err.message}`;
      setError(msg);
      setScanState(STATE.NO_CAMERA);
    }
  };

  const scheduleScan = () => {
    rafRef.current = requestAnimationFrame(tickScan);
  };

  const tickScan = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      scheduleScan();
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    try {
      // Dynamically import jsQR to avoid bundling if not needed
      const jsQR = (await import('jsqr')).default;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code?.data) {
        const parsed = parseQRPayload(code.data);
        if (parsed) {
          setScanState(STATE.SUCCESS);
          stopCamera();
          onResult(parsed);
          return;
        }
      }
    } catch {
      // jsQR not installed — show manual entry
      setScanState(STATE.NO_SUPPORT);
      stopCamera();
      return;
    }

    scheduleScan();
  };

  const handleManualSubmit = () => {
    const parsed = parseQRPayload(manualInput.trim());
    if (parsed) {
      onResult(parsed);
    } else if (manualInput.trim()) {
      onResult({ regNumber: manualInput.trim().toUpperCase(), examId: null });
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-label="QR Scanner" aria-modal="true">
      <div
        className="glass-modal w-full"
        style={{ maxWidth: 480 }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5"
          style={{ borderBottom: '1px solid var(--glass-border)' }}
        >
          <div>
            <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Scan QR Code</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Point your camera at a campus exam seating QR code
            </p>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="glass-btn glass-btn-ghost glass-btn-icon"
            aria-label="Close scanner"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Camera view */}
          {(scanState === STATE.SCANNING || scanState === STATE.REQUESTING) && (
            <div className="relative rounded-xl overflow-hidden aspect-video" style={{ background: '#000' }}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
              />
              <canvas ref={canvasRef} className="hidden" />
              {/* Scan overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-48 h-48 relative"
                  style={{ border: '2px solid rgba(244,180,0,0.8)', borderRadius: 12 }}
                >
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-yellow-400 rounded-br-lg" />
                  {/* Scan line */}
                  <div
                    className="absolute inset-x-0 h-0.5"
                    style={{
                      background: 'rgba(244,180,0,0.7)',
                      animation: 'float 1.5s ease-in-out infinite',
                      top: '50%',
                    }}
                  />
                </div>
              </div>
              {scanState === STATE.REQUESTING && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
                  <p className="text-white text-sm font-medium">Requesting camera...</p>
                </div>
              )}
            </div>
          )}

          {/* Idle — start button */}
          {scanState === STATE.IDLE && (
            <div
              className="flex flex-col items-center gap-4 py-8 rounded-xl"
              style={{ background: 'var(--glass-1)', border: '1px dashed var(--glass-border-strong)' }}
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-xl" style={{ background: 'var(--gold-light)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Camera access needed</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Works on HTTPS and localhost</p>
              </div>
              <button className="glass-btn glass-btn-primary" onClick={startScanning}>
                Enable Camera
              </button>
            </div>
          )}

          {/* Error / No camera */}
          {(scanState === STATE.NO_CAMERA || scanState === STATE.NO_SUPPORT || scanState === STATE.ERROR) && (
            <div
              className="flex flex-col items-center gap-3 py-6 rounded-xl text-center"
              style={{ background: 'var(--red-light)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-sm font-medium" style={{ color: 'var(--red)' }}>
                {error || (scanState === STATE.NO_SUPPORT ? 'QR scanning requires the jsQR package. Run: npm install jsqr' : 'Camera unavailable')}
              </p>
            </div>
          )}

          {/* Manual fallback — always shown */}
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 16 }}>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              Or enter manually
            </p>
            <div className="flex gap-2">
              <input
                className="glass-input flex-1"
                placeholder="Registration number"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
                autoCapitalize="characters"
              />
              <button
                className="glass-btn glass-btn-primary"
                onClick={handleManualSubmit}
                disabled={!manualInput.trim()}
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

