import React, { useState, useRef, useEffect } from "react";
import Loader from "../components/Loader";

/**
 * Home.jsx
 * - Logic: UNCHANGED
 * - Layout/Structure: UNCHANGED (Optimized with responsive utilities)
 * - Fonts: UNCHANGED
 * - Theme: Dark Blue (#0B0E11) + Violet Accents
 */

export default function Home() {
  const [isPageReady, setIsPageReady] = useState(false);
  useEffect(() => {
    // Simulate a brief delay or wait for actual data
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1200); // 1.2 seconds feels snappy but professional

    return () => clearTimeout(timer);
  }, []);

  
  const LS = { server: "koset_server", last: "koset_last_upload" };
  
  const API_URL = import.meta.env.VITE_API_URL;
  const ANALYSIS_URL = import.meta.env.VITE_ANALYSIS_URL;

  const [serverUrl, setServerUrl] = useState(API_URL);

  const [projectName, setProjectName] = useState("default_project");
  const [datasetName, setDatasetName] = useState("default_dataset");

  const trainingRef = useRef(null);
  const datasetRef = useRef(null);
  
  const [trainingFilesList, setTrainingFilesList] = useState([]);
  const [datasetFilesList, setDatasetFilesList] = useState([]);

  const [uploadOutput, setUploadOutput] = useState(null);
  const [analyzeOutput, setAnalyzeOutput] = useState(null);

  // split uploaded files into two lists, shown under corresponding sections
  const [uploadedTrainingFiles, setUploadedTrainingFiles] = useState([]);
  const [uploadedDatasetFiles, setUploadedDatasetFiles] = useState([]);

  const [sourceInput, setSourceInput] = useState("");
  const [useLLM, setUseLLM] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);

  // time-left estimate
  const [analyzeStart, setAnalyzeStart] = useState(null);
  const [timeLeftSec, setTimeLeftSec] = useState(null);
  const timeEstimateInterval = useRef(null);

  // status messages
  const statusMessages = [
    "Working on it...",
    "Hold on for a sec",
    "Almost done...",
  ];
  const [statusIndex, setStatusIndex] = useState(0);
  const statusInterval = useRef(null);

  // per-file analysis state
  const [fileAnalysisState, setFileAnalysisState] = useState([]); // {name, kind, progress, done, id}

  useEffect(() => {
    return () => {
      clearInterval(progressInterval.current);
      clearInterval(statusInterval.current);
      clearInterval(timeEstimateInterval.current);
    };
  }, []);

  // ==========================================
  // DATASET VALIDATION HELPER FUNCTION
  // ==========================================
  const validateDatasetFile = (file) => {
    return new Promise((resolve) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        return resolve("Only .csv files are allowed.");
      }
      const nameParts = file.name.split(".");
      if (nameParts.length > 2) {
        return resolve(
          "Filename has invalid double extensions (e.g., .exe.csv). Please rename."
        );
      }
      if (file.size < 10) {
        return resolve("File is empty or too small to be a valid dataset.");
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        if (/\u0000/.test(text)) {
          return resolve(
            "File contains binary content. Real CSV text required."
          );
        }
        const rows = text.split(/\r\n|\n/).filter((r) => r.trim() !== "");
        if (rows.length < 2) {
          return resolve("CSV must have at least 2 rows (Headers + Data).");
        }
        const headers = rows[0].split(",");
        if (headers.length < 2) {
          return resolve("CSV must have at least 2 columns.");
        }
        const firstRowData = rows[1].split(",");
        if (headers.length !== firstRowData.length) {
          return resolve(
            `Column count mismatch. Header has ${headers.length}, but Row 1 has ${firstRowData.length}.`
          );
        }
        resolve(null); 
      };
      reader.onerror = () => resolve("Error reading file.");
      reader.readAsText(file);
    });
  };

  function normalizeServer(u) {
    if (!u) return "";
    return u.replace(/\/+$/, "");
  }

  function saveServer() {
    localStorage.setItem(LS.server, serverUrl);
    setUploadOutput({ notice: "Server saved to localStorage" });
    setTimeout(() => setUploadOutput(null), 1400);
  }

  async function ping() {
    try {
      const res = await fetch(normalizeServer(serverUrl) + "/health");
      const txt = await res.text();
      setUploadOutput({ ping: txt });
    } catch (e) {
      setUploadOutput({ ping: "Failed to reach server" });
    }
  }

  // preview reading
  function readFilesPreview(inputRef, setter, kind) {
    const files = inputRef.current?.files || [];
    const arr = Array.from(files).map((f, i) => ({
      name: f.name,
      size: f.size,
      file: f,
      kind,
      id: `${kind}-${f.name}-${i}`,
    }));
    setter(arr);

    setFileAnalysisState((prev) => {
      const filtered = prev.filter((p) => p.kind !== kind);
      const newEntries = arr.map((a) => ({
        name: a.name,
        kind: a.kind,
        progress: 0,
        done: false,
        id: a.id,
      }));
      return [...filtered, ...newEntries];
    });
  }

  // animation controllers
  function startAnimation() {
    clearInterval(progressInterval.current);
    clearInterval(statusInterval.current);
    clearInterval(timeEstimateInterval.current);
    setProgress(5);
    progressInterval.current = setInterval(() => {
      setProgress((p) => Math.min(92, Math.round(p + Math.random() * 6 + 1)));
    }, 650);
    setStatusIndex(0);
    statusInterval.current = setInterval(
      () => setStatusIndex((s) => (s + 1) % statusMessages.length),
      1800
    );
  }

  function stopAnimation(finalDelay = 350) {
    clearInterval(progressInterval.current);
    clearInterval(statusInterval.current);
    clearInterval(timeEstimateInterval.current);
    setProgress(100);
    setTimeout(() => {
      setProgress(0);
      setStatusIndex(0);
      setAnalyzeStart(null);
      setTimeLeftSec(null);
    }, finalDelay);
  }

  // simulate per-file analysis visuals
  function simulateFileAnalysis(files) {
    if (!files || files.length === 0) return;
    setFileAnalysisState((prev) => {
      const existingIds = prev.map((p) => p.id);
      const newOnes = files
        .filter((f) => !existingIds.includes(f.id))
        .map((f) => ({
          name: f.name,
          kind: f.kind,
          progress: 0,
          done: false,
          id: f.id,
        }));
      return [...prev, ...newOnes];
    });

    const timers = files.map((file, idx) =>
      setInterval(() => {
        setFileAnalysisState((prev) =>
          prev.map((p) => {
            if (p.id !== file.id) return p;
            const inc = Math.floor(Math.random() * 18) + 5;
            const next = Math.min(100, p.progress + inc);
            return { ...p, progress: next, done: next >= 100 };
          })
        );
      }, 450 + idx * 150)
    );

    const watcher = setInterval(() => {
      setFileAnalysisState((prev) => {
        const allDone =
          prev.length > 0 && prev.every((p) => p.done || p.progress >= 100);
        if (allDone) {
          timers.forEach(clearInterval);
          clearInterval(watcher);
        }
        return prev;
      });
    }, 700);

    setTimeout(() => {
      timers.forEach(clearInterval);
      clearInterval(watcher);
      setFileAnalysisState((prev) =>
        prev.map((p) => ({ ...p, progress: 100, done: true }))
      );
    }, 12000);
  }

  function fmtSize(n) {
    if (n == null) return "";
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  }

  // upload handler
  async function handleUpload() {
    const datasetFiles = datasetRef.current?.files || [];
    for (const file of datasetFiles) {
      const error = await validateDatasetFile(file);
      if (error) {
        setUploadOutput({
          error: `Validation Failed: ${file.name} - ${error}`,
        });
        return; 
      }
    }

    readFilesPreview(trainingRef, setTrainingFilesList, "training");
    readFilesPreview(datasetRef, setDatasetFilesList, "dataset");

    setUploading(true);
    setUploadOutput(null);
    startAnimation();

    const fd = new FormData();
    fd.append("project_name", projectName || "default_project");
    fd.append("dataset_name", datasetName || "default_dataset");
    const trainingFiles = trainingRef.current?.files || [];
    for (const f of trainingFiles) fd.append("training_files", f);
    for (const f of datasetFiles) fd.append("dataset_files", f);

    const combined = [
      ...Array.from(trainingFiles).map((f, i) => ({
        name: f.name,
        kind: "training",
        id: `training-${f.name}-${i}`,
      })),
      ...Array.from(datasetFiles).map((f, i) => ({
        name: f.name,
        kind: "dataset",
        id: `dataset-${f.name}-${i}`,
      })),
    ];
    simulateFileAnalysis(combined);

    try {
      const res = await fetch(normalizeServer(serverUrl) + "/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json();

      const upTraining = [];
      const upDataset = [];

      if (data?.training?.saved_files && Array.isArray(data.training.saved_files)) {
        upTraining.push(...data.training.saved_files);
      }
      if (data?.dataset?.saved_files && Array.isArray(data.dataset.saved_files)) {
        upDataset.push(...data.dataset.saved_files);
      }

      if (upTraining.length === 0 && data?.saved_files && Array.isArray(data.saved_files)) {
        data.saved_files.forEach((p) => {
          if (/\.(py|ipynb)$/.test(p)) upTraining.push(p);
          else upDataset.push(p);
        });
      }

      if (upTraining.length === 0)
        upTraining.push(...Array.from(trainingFiles).map((f) => f.name));
      if (upDataset.length === 0)
        upDataset.push(...Array.from(datasetFiles).map((f) => f.name));

      localStorage.setItem(
        LS.last,
        JSON.stringify({
          training_path: data.training?.training_primary_file || null,
          dataset_path: data.dataset?.dataset_primary_file || null,
        })
      );

      setTimeout(() => {
        stopAnimation(300);
        setUploading(false);
        setUploadOutput({ success: true, data });
        setUploadedTrainingFiles(upTraining);
        setUploadedDatasetFiles(upDataset);
        setFileAnalysisState((prev) =>
          prev.map((p) => ({ ...p, progress: 100, done: true }))
        );
      }, 700 + Math.random() * 900);
    } catch (err) {
      stopAnimation(200);
      setUploading(false);
      setUploadOutput({ error: String(err) });
    }
  }

  // analyze handler
  async function handleAnalyze() {
    setAnalyzing(true);
    setAnalyzeOutput(null);
    startAnimation();
    setAnalyzeStart(Date.now());
    setTimeLeftSec(null);

    timeEstimateInterval.current = setInterval(() => {
      setTimeLeftSec(calculateTimeLeftSec());
    }, 800);

    const saved = JSON.parse(localStorage.getItem(LS.last) || "{}");
    const payload = { use_llm_fallback: useLLM };
    if (sourceInput?.trim()) payload.source = sourceInput.trim();
    else if (saved.training_path) payload.training_path = saved.training_path;
    if (saved.dataset_path) payload.dataset_path = saved.dataset_path;

    const combined = [
      ...trainingFilesList.map((f, i) => ({
        name: f.name,
        kind: "training",
        id: `training-${f.name}-${i}`,
      })),
      ...datasetFilesList.map((f, i) => ({
        name: f.name,
        kind: "dataset",
        id: `dataset-${f.name}-${i}`,
      })),
    ];
    if (combined.length) {
      setFileAnalysisState(
        combined.map((c) => ({ ...c, progress: 0, done: false }))
      );
      simulateFileAnalysis(combined);
    }

    try {
      const res = await fetch(normalizeServer(ANALYSIS_URL) + "/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
       
      });
      const data = await res.json();

      setTimeout(() => {
        stopAnimation(450);
        setAnalyzing(false);
        setAnalyzeOutput({ success: true, data });
        setFileAnalysisState((prev) =>
          prev.map((p) => ({ ...p, progress: 100, done: true }))
        );
        setTimeLeftSec(0);
      }, 900 + Math.random() * 900);
    } catch (err) {
      stopAnimation(200);
      setAnalyzing(false);
      setAnalyzeOutput({ error: String(err) });
      setTimeLeftSec(null);
    }
  }

  function calculateTimeLeftSec() {
    if (!analyzeStart) return null;
    const elapsedMs = Date.now() - analyzeStart;
    if (progress <= 1) return null;
    const perPercentMs = elapsedMs / Math.max(1, progress);
    const remainingMs = perPercentMs * (100 - progress);
    return Math.round(remainingMs / 1000);
  }

  // small JSON block
  function JsonBlock({ value }) {
    if (!value)
      return <div className="text-sm text-gray-500">No output yet.</div>;
    return (
      <pre className="bg-[#0B0E11] border border-white/10 p-3 rounded-md text-xs sm:text-sm overflow-auto max-h-64 text-gray-300">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  // file card UI
  function FileCard({ f }) {
    return (
      <div className="flex items-center gap-3 bg-[#0B0E11] p-3 rounded-lg border border-white/10">
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded bg-[#161b22]">
          <svg
            className="w-5 h-5 text-violet-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7 2h6l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-200 truncate">{f.name}</div>
            <div className="text-xs text-gray-500 ml-2">{fmtSize(f.size)}</div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-[#161b22] rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all ${
                  f.done ? "bg-emerald-500" : "bg-violet-500"
                }`}
                style={{ width: `${f.progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {f.done ? "Analyzed" : `${f.progress}%`}
            </div>
          </div>
        </div>
        <div className="w-10 flex-shrink-0 flex items-center justify-center">
          {f.done ? (
            <svg
              className="w-5 h-5 text-emerald-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 animate-spin text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </div>
      </div>
    );
  }

  // Status banner (top)
  function StatusBanner() {
    const active = uploading || analyzing;
    const text = active ? statusMessages[statusIndex] : "Ready";
    const sub = uploading
      ? "Uploading files and scanning..."
      : analyzing
      ? "Parsing script & scanning dataset..."
      : "Idle — choose files or provide a source URL.";
    return (
      <div
        className={`w-full rounded-md p-3 mb-6 transition-all border ${
          active
            ? "bg-violet-900/20 border-violet-500/50 text-white shadow-lg"
            : "bg-[#161b22] border-white/10 text-gray-300"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 flex-shrink-0 rounded-full ${
                active ? "bg-violet-600/30" : "bg-[#0B0E11]"
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  active ? "animate-pulse text-violet-300" : "text-gray-500"
                }`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2v6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16v6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 8h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 18h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div className="font-medium text-sm sm:text-base">{text}</div>
              <div className="text-xs text-gray-400">{sub}</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 sm:block hidden">Status indicator</div>
        </div>
      </div>
    );
  }

  // pipeline visual
  function PipelineVisual() {
    const active = uploading || analyzing;
    return (
      <div className="mt-4 p-3 bg-[#161b22] rounded-md border border-white/10">
        <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
          <div className="font-medium">Processing pipeline</div>
          <div className="text-xs text-gray-500">
            {active ? `Progress ${progress}%` : "Idle"}
          </div>
        </div>

        {/* Added overflow-x-auto to prevent layout break on small screens */}
        <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto py-2 scrollbar-hide">
          <Stage title="Uploaded" done={progress > 5} />
          <Connector active={active} />
          <Stage title="Scanned" done={progress > 40} />
          <Connector active={active} />
          <Stage title="Analyzed" done={progress > 90} />
        </div>

        <div className="relative h-6 mt-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-1 rounded-full bg-white/10" />
          </div>
          <div
            className={`absolute left-0 top-0 h-6 flex items-center pointer-events-none ${
              active ? "animate-flow" : ""
            }`}
          >
            <div
              className="token bg-violet-500 w-3 h-3 rounded-full mr-2 opacity-90"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="token bg-emerald-500 w-3 h-3 rounded-full mr-2 opacity-80"
              style={{ animationDelay: "200ms" }}
            />
            <div
              className="token bg-amber-500 w-3 h-3 rounded-full"
              style={{ animationDelay: "400ms" }}
            />
          </div>
        </div>

        <style>{`
          @keyframes flow {
            0% { transform: translateX(0%); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateX(1000%); opacity: 0; }
          }
          .animate-flow .token { animation-name: flow; animation-duration: 2.6s; animation-iteration-count: infinite; animation-timing-function: linear; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    );
  }

  function Stage({ title, done }) {
    return (
      <div className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[70px]">
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border ${
            done
              ? "bg-emerald-500 text-white border-emerald-500"
              : "bg-[#0B0E11] text-gray-500 border-white/10"
          }`}
        >
          {done ? (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="8"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          )}
        </div>
        <div className="text-[10px] sm:text-xs text-gray-400">{title}</div>
      </div>
    );
  }

  function Connector({ active }) {
    return (
      <div
        className={`flex-1 min-w-[20px] h-0.5 ${
          active
            ? "bg-gradient-to-r from-violet-500 to-emerald-500"
            : "bg-white/10"
        }`}
      />
    );
  }

  // Parsing overlay shown during analyze
  function ParsingOverlay() {
    if (!analyzing) return null;
    const left = timeLeftSec == null ? "--" : `${timeLeftSec}s`;
    const messages = [
      "Loading training files...",
      "Scanning imports & dependencies...",
      "Building TF-IDF / tokenizers...",
      "Profiling dataset columns...",
      "Inferring model candidates...",
      "Finalizing results...",
    ];

    return (
      <div className="mt-4 relative">
        <div className="absolute inset-0 bg-black/60 rounded-md pointer-events-none" />
        <div className="relative p-4 bg-[#161b22] rounded-md border border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
            <div>
              <div className="font-medium text-base sm:text-lg text-white">
                {statusMessages[statusIndex]}
              </div>
              <div className="text-xs text-gray-400">
                Parsing script in background — extracting structure, scanning
                imports, and profiling data.
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Estimated time left:{" "}
              <span className="font-medium text-white">{left}</span>
            </div>
          </div>

          <div className="w-full bg-[#0B0E11] rounded-full h-3 overflow-hidden mb-2">
            <div
              className="h-3 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-xs text-gray-300 mb-2">
            Parsing log (simulated):
          </div>

          <div className="h-20 bg-[#0B0E11] rounded p-2 overflow-auto text-xs font-mono text-gray-400 border border-white/5">
            {messages.map((m, i) => (
              <div key={i}>
                {"\u2192"} {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
if (!isPageReady) return <Loader />;
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <StatusBanner />
        </div>

        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">Koset API Tester</h1>
            <p className="text-sm text-gray-400 mt-1">
              Clear upload zones and pipeline visuals help users understand
              what's happening.
            </p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload column */}
          <section className="lg:col-span-1 bg-[#161b22] border border-white/10 rounded-xl p-4 sm:p-6 shadow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-semibold">
                1) Upload Training & Dataset
              </h2>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                Preview
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm text-gray-300">Project Name</label>
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full mt-1 p-2 rounded-md bg-[#0B0E11] border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Dataset Name</label>
                <input
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  className="w-full mt-1 p-2 rounded-md bg-[#0B0E11] border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <label className="text-sm text-gray-300">Training Files</label>
              <div
                className="border-2 border-dashed border-white/10 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-violet-500 transition-colors bg-[#0B0E11]/50"
                onClick={() =>
                  trainingRef.current && trainingRef.current.click()
                }
              >
                <input
                  ref={trainingRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={() =>
                    readFilesPreview(
                      trainingRef,
                      setTrainingFilesList,
                      "training"
                    )
                  }
                />
                <svg
                  className="w-8 h-8 text-violet-400 mb-2"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 3v12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 7l4-4 4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 21H4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-xs text-gray-300">
                  Select training files (.py, .ipynb)
                </div>
              </div>
              <div className="space-y-2">
                  {trainingFilesList.length === 0 ? (
                    <div className="text-xs text-gray-500 italic">No training files.</div>
                  ) : (
                    trainingFilesList.map((f) => (
                      <FileCard
                        key={f.id}
                        f={{
                          ...f,
                          progress: fileAnalysisState.find((p) => p.id === f.id)?.progress || 0,
                          done: fileAnalysisState.find((p) => p.id === f.id)?.done || false,
                        }}
                      />
                    ))
                  )}
              </div>

              <label className="text-sm text-gray-300">Dataset Files</label>
              <div
                className="border-2 border-dashed border-white/10 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 transition-colors bg-[#0B0E11]/50"
                onClick={() => datasetRef.current && datasetRef.current.click()}
              >
                <input
                  ref={datasetRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    for (const file of files) {
                      const error = await validateDatasetFile(file);
                      if (error) {
                        alert(`Invalid file "${file.name}":\n${error}`);
                        e.target.value = "";
                        setDatasetFilesList([]);
                        return;
                      }
                    }
                    readFilesPreview(datasetRef, setDatasetFilesList, "dataset");
                  }}
                />
                <svg
                  className="w-8 h-8 text-emerald-400 mb-2"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path d="M21 15V7a2 2 0 0 0-2-2h-6M3 9v8a2 2 0 0 0 2 2h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <div className="text-xs text-gray-300">
                  Select dataset files (.csv)
                </div>
              </div>
              <div className="space-y-2">
                  {datasetFilesList.length === 0 ? (
                    <div className="text-xs text-gray-500 italic">No dataset files.</div>
                  ) : (
                    datasetFilesList.map((f) => (
                      <FileCard
                        key={f.id}
                        f={{
                          ...f,
                          progress: fileAnalysisState.find((p) => p.id === f.id)?.progress || 0,
                          done: fileAnalysisState.find((p) => p.id === f.id)?.done || false,
                        }}
                      />
                    ))
                  )}
              </div>
            </div>

            {/* actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                disabled={uploading}
                onClick={handleUpload}
                className="flex-1 min-w-[100px] flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg font-semibold shadow text-sm"
              >
                {uploading ? "Uploading..." : "Upload"}
                {uploading && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => {
                  setTrainingFilesList([]);
                  setDatasetFilesList([]);
                  setUploadOutput(null);
                  setFileAnalysisState([]);
                }}
                className="flex-1 min-w-[80px] bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm"
              >
                Reset
              </button>

              <div className="w-full mt-2 sm:mt-0 sm:flex-1">
                <div className="w-full bg-[#161b22] rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="h-2 rounded-full transition-all bg-violet-500"
                    style={{ width: `${uploading ? progress : 0}%` }}
                  />
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {uploading ? statusMessages[statusIndex] : "Upload system ready"}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Output</div>
              <JsonBlock value={uploadOutput} />
            </div>
          </section>

          {/* Analyze + pipeline */}
          <section className="lg:col-span-2 bg-[#161b22] border border-white/10 rounded-xl p-4 sm:p-6 shadow space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-semibold">2) Estimate & Analyze</h2>
                <div className="text-xs text-gray-400 mt-1">
                  Inspect code + data metadata
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#0B0E11] p-2 rounded-lg border border-white/5">
                <label className="text-xs text-gray-300">
                  LLM Fallback
                </label>
                <input
                  type="checkbox"
                  checked={useLLM}
                  onChange={(e) => setUseLLM(e.target.checked)}
                  className="h-4 w-4 accent-violet-600 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <label className="text-xs text-gray-300 mb-1.5 block">
                  Source (optional)
                </label>
                <input
                  value={sourceInput}
                  onChange={(e) => setSourceInput(e.target.value)}
                  placeholder="GitHub, HuggingFace, or URL"
                  className="w-full p-2.5 rounded-md bg-[#0B0E11] border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  disabled={analyzing}
                  onClick={handleAnalyze}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-semibold shadow text-sm whitespace-nowrap"
                >
                  {analyzing ? "Analyzing..." : "Analyze"}
                </button>
                <button
                  onClick={() => setAnalyzeOutput(null)}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-2.5 rounded-lg text-sm"
                >
                  Clear
                </button>
              </div>
            </div>

            <ParsingOverlay />
            <PipelineVisual />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-6">
              <div>
                <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">
                  Overview
                </div>
                <div className="text-xs sm:text-sm text-gray-300 bg-[#0B0E11] p-4 rounded border border-white/10 leading-relaxed">
                  Estimate & Analyze inspects training code and dataset to
                  detect framework, preprocessing steps, and model params. Use a source URL to analyze public repos directly.
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">
                  Analysis Result
                </div>
                <JsonBlock value={analyzeOutput} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}