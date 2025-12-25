import React, { useState, useRef, useEffect } from "react";

/**
 * Home.jsx
 * - Uploaded training files and uploaded dataset files shown separately and directly under their upload sections
 * - Parsing overlay uses unicode arrows (no JSX '>' warnings)
 * - Retains previous animations, pipeline, progress and file previews
 * - ADDED: Strict Dataset File Validation (CSV only, structure checks, binary checks)
 *
 * Requirements: Tailwind CSS in project.
 */

export default function Home() {
  const LS = { server: "koset_server", last: "koset_last_upload" };

  const [serverUrl, setServerUrl] = useState(
    () =>
      localStorage.getItem(LS.server) ||
      "https://koset-agents-deploy.onrender.com"
  );

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
  // NEW: DATASET VALIDATION HELPER FUNCTION
  // ==========================================
  const validateDatasetFile = (file) => {
    return new Promise((resolve) => {
      // 1. Check extension
      if (!file.name.toLowerCase().endsWith(".csv")) {
        return resolve("Only .csv files are allowed.");
      }

      // 2. Check for double extensions (e.g. data.ss.csv, file.exe.csv)
      const nameParts = file.name.split(".");
      if (nameParts.length > 2) {
        return resolve(
          "Filename has invalid double extensions (e.g., .exe.csv). Please rename."
        );
      }

      // 3. Check empty or very small files
      if (file.size < 10) {
        return resolve("File is empty or too small to be a valid dataset.");
      }

      // 4. Read content to check binary and structure
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;

        // Check for binary characters (null bytes)
        if (/\u0000/.test(text)) {
          return resolve(
            "File contains binary content. Real CSV text required."
          );
        }

        const rows = text.split(/\r\n|\n/).filter((r) => r.trim() !== "");

        // Check Row Count
        if (rows.length < 2) {
          return resolve("CSV must have at least 2 rows (Headers + Data).");
        }

        // Check Headers
        const headers = rows[0].split(",");
        if (headers.length < 2) {
          return resolve("CSV must have at least 2 columns.");
        }

        // Check Consistency (Header vs First Row)
        const firstRowData = rows[1].split(",");
        if (headers.length !== firstRowData.length) {
          return resolve(
            `Column count mismatch. Header has ${headers.length}, but Row 1 has ${firstRowData.length}.`
          );
        }

        resolve(null); // Valid
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
      // replace previous of same kind
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

  // helper size format
  function fmtSize(n) {
    if (n == null) return "";
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  }

  // upload handler (now populates uploadedTrainingFiles and uploadedDatasetFiles separately)
  async function handleUpload() {
    // 1️⃣ VALIDATE DATASET FILES BEFORE UPLOAD STARTS
    const datasetFiles = datasetRef.current?.files || [];
    for (const file of datasetFiles) {
      const error = await validateDatasetFile(file);
      if (error) {
        setUploadOutput({
          error: `Validation Failed: ${file.name} - ${error}`,
        });
        return; // Abort upload
      }
    }

    // take preview immediately
    readFilesPreview(trainingRef, setTrainingFilesList, "training");
    readFilesPreview(datasetRef, setDatasetFilesList, "dataset");

    setUploading(true);
    setUploadOutput(null);
    startAnimation();

    const fd = new FormData();
    fd.append("project_name", projectName || "default_project");
    fd.append("dataset_name", datasetName || "default_dataset");
    const trainingFiles = trainingRef.current?.files || [];
    // const datasetFiles = datasetRef.current?.files || []; // Already grabbed above
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
      });
      const data = await res.json();

      // Determine uploaded training vs dataset files from common response shapes
      const upTraining = [];
      const upDataset = [];

      // if backend returns training.saved_files as array
      if (
        data?.training?.saved_files &&
        Array.isArray(data.training.saved_files)
      ) {
        upTraining.push(...data.training.saved_files);
      }
      // if backend returns dataset.saved_files as array
      if (
        data?.dataset?.saved_files &&
        Array.isArray(data.dataset.saved_files)
      ) {
        upDataset.push(...data.dataset.saved_files);
      }

      // if backend returns a flat saved_files or saved_files grouped differently, try to populate sensibly
      if (
        upTraining.length === 0 &&
        data?.saved_files &&
        Array.isArray(data.saved_files)
      ) {
        // try to split by extension heuristics
        data.saved_files.forEach((p) => {
          if (/\.(py|ipynb)$/.test(p)) upTraining.push(p);
          else upDataset.push(p);
        });
      }

      // fallback: use selected names for each group if backend didn't return
      if (upTraining.length === 0)
        upTraining.push(...Array.from(trainingFiles).map((f) => f.name));
      if (upDataset.length === 0)
        upDataset.push(...Array.from(datasetFiles).map((f) => f.name));

      // store last paths for analysis
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
        // set the two uploaded lists separately
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

  // analyze handler (starts time-left estimator and background parsing visual)
  async function handleAnalyze() {
    setAnalyzing(true);
    setAnalyzeOutput(null);
    startAnimation();
    setAnalyzeStart(Date.now());
    setTimeLeftSec(null);

    // kick time estimator interval
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
      const res = await fetch(normalizeServer(serverUrl) + "/analyze", {
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

  // estimate time left in seconds using linear extrapolation from progress
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
      return <div className="text-sm text-slate-400">No output yet.</div>;
    return (
      <pre className="bg-slate-900/60 p-3 rounded-md text-xs sm:text-sm overflow-auto max-h-64">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  // file card UI
  function FileCard({ f }) {
    return (
      <div className="flex items-center gap-3 bg-white/3 p-3 rounded-lg border border-white/6">
        <div className="w-10 h-10 flex items-center justify-center rounded bg-gradient-to-br from-slate-700 to-slate-800">
          <svg
            className="w-5 h-5 text-cyan-300"
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
            <div className="text-sm font-medium truncate">{f.name}</div>
            <div className="text-xs text-slate-400">{fmtSize(f.size)}</div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-slate-900/30 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all ${
                  f.done ? "bg-emerald-400" : "bg-cyan-400"
                }`}
                style={{ width: `${f.progress}%` }}
              />
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {f.done ? "Analyzed" : `${f.progress}%`}
            </div>
          </div>
        </div>
        <div className="w-10 flex items-center justify-center">
          {f.done ? (
            <svg
              className="w-5 h-5 text-emerald-400"
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
              className="w-5 h-5 animate-pulse text-slate-400"
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
        className={`w-full rounded-md p-3 mb-6 transition-all ${
          active
            ? "bg-gradient-to-r from-cyan-700 to-emerald-500 text-slate-900 shadow-lg"
            : "bg-slate-800/40 text-slate-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                active ? "bg-white/30" : "bg-slate-700"
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  active ? "animate-pulse text-white" : "text-slate-300"
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
              <div className="font-medium">{text}</div>
              <div className="text-xs text-slate-200/80">{sub}</div>
            </div>
          </div>
          <div className="text-xs text-slate-200/70">Status indicator</div>
        </div>
      </div>
    );
  }

  // pipeline visual
  function PipelineVisual() {
    const active = uploading || analyzing;
    return (
      <div className="mt-4 p-3 bg-slate-900/30 rounded-md border border-slate-800">
        <div className="flex items-center justify-between text-sm text-slate-300 mb-3">
          <div className="font-medium">Processing pipeline</div>
          <div className="text-xs text-slate-400">
            {active ? `Progress ${progress}%` : "Idle"}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Stage title="Uploaded" done={progress > 5} />
          <Connector active={active} />
          <Stage title="Scanned" done={progress > 40} />
          <Connector active={active} />
          <Stage title="Analyzed" done={progress > 90} />
        </div>

        <div className="relative h-6 mt-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-1 rounded-full bg-slate-800/40" />
          </div>
          <div
            className={`absolute left-0 top-0 h-6 flex items-center pointer-events-none ${
              active ? "animate-flow" : ""
            }`}
          >
            <div
              className="token bg-cyan-400 w-3 h-3 rounded-full mr-2 opacity-90"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="token bg-emerald-400 w-3 h-3 rounded-full mr-2 opacity-80"
              style={{ animationDelay: "200ms" }}
            />
            <div
              className="token bg-amber-400 w-3 h-3 rounded-full"
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
        `}</style>
      </div>
    );
  }

  function Stage({ title, done }) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            done
              ? "bg-emerald-400 text-slate-900"
              : "bg-slate-800/40 text-slate-300"
          }`}
        >
          {done ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
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
        <div className="text-xs">{title}</div>
      </div>
    );
  }

  function Connector({ active }) {
    return (
      <div
        className={`flex-1 h-0.5 ${
          active
            ? "bg-gradient-to-r from-cyan-400 to-emerald-400"
            : "bg-slate-700/40"
        }`}
      />
    );
  }

  // Parsing overlay shown during analyze with progress & time-left (no JSX > warnings)
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
        <div className="absolute inset-0 bg-black/30 rounded-md pointer-events-none" />
        <div className="relative p-4 bg-slate-900/70 rounded-md border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-medium text-lg">
                {statusMessages[statusIndex]}
              </div>
              <div className="text-xs text-slate-400">
                Parsing script in background — extracting structure, scanning
                imports, and profiling data.
              </div>
            </div>
            <div className="text-xs text-slate-400">
              Estimated time left:{" "}
              <span className="font-medium text-white">{left}</span>
            </div>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden mb-2">
            <div
              className="h-3 rounded-full bg-emerald-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-xs text-slate-300 mb-2">
            Parsing log (simulated):
          </div>

          <div className="h-20 bg-black/20 rounded p-2 overflow-auto text-xs font-mono text-slate-300">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <StatusBanner />
        </div>

        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Koset API Tester</h1>
            <p className="text-sm text-slate-400 mt-1">
              Clear upload zones and pipeline visuals help users understand
              what's happening.
            </p>
          </div>

          <div className="w-full md:w-96">
            <label className="block text-sm text-slate-300 mb-1">
              Backend URL
            </label>
            <div className="flex gap-2">
              <input
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                className="flex-1 bg-slate-900/60 border border-slate-700 rounded-md p-2 text-sm"
              />
              <button
                onClick={saveServer}
                className="px-3 rounded-md bg-cyan-300 text-slate-900 font-medium"
              >
                Save
              </button>
              <button
                onClick={ping}
                className="px-3 rounded-md bg-slate-700 text-sm"
              >
                Ping
              </button>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload column */}
          <section className="lg:col-span-1 bg-slate-900/40 border border-slate-800 rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">
                1) Upload Training & Dataset
              </h2>
              <div className="text-xs text-slate-400">
                Files will be previewed below
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm text-slate-300">Project Name</label>
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full mt-1 p-2 rounded-md bg-slate-900/60 border border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Dataset Name</label>
                <input
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  className="w-full mt-1 p-2 rounded-md bg-slate-900/60 border border-slate-700 text-sm"
                />
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <label className="text-sm text-slate-300">Training Files</label>
              <div
                className="border-2 border-dashed border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cyan-400 transition-colors"
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
                  className="w-8 h-8 text-cyan-300 mb-2"
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
                <div className="text-sm text-slate-300">
                  Click to select training files — .py, .ipynb, etc
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  You can select multiple files
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-300">
                    Selected training files
                  </div>
                  <div className="text-xs text-slate-400">
                    {trainingFilesList.length} file(s)
                  </div>
                </div>
                <div className="space-y-2">
                  {trainingFilesList.length === 0 ? (
                    <div className="text-xs text-slate-400">
                      No training files chosen.
                    </div>
                  ) : (
                    trainingFilesList.map((f) => (
                      <FileCard
                        key={f.id}
                        f={{
                          ...f,
                          progress:
                            fileAnalysisState.find((p) => p.id === f.id)
                              ?.progress || 0,
                          done:
                            fileAnalysisState.find((p) => p.id === f.id)
                              ?.done || false,
                        }}
                      />
                    ))
                  )}
                </div>
              </div>

              <label className="text-sm text-slate-300">Dataset Files</label>
              <div
                className="border-2 border-dashed border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-400 transition-colors"
                onClick={() => datasetRef.current && datasetRef.current.click()}
              >
                <input
                  ref={datasetRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    // 2️⃣ VALIDATE DATASET FILES ON SELECTION
                    const files = Array.from(e.target.files || []);
                    for (const file of files) {
                      const error = await validateDatasetFile(file);
                      if (error) {
                        alert(`Invalid file "${file.name}":\n${error}`);
                        e.target.value = ""; // Reset input
                        setDatasetFilesList([]); // Do not update list
                        return;
                      }
                    }
                    readFilesPreview(
                      datasetRef,
                      setDatasetFilesList,
                      "dataset"
                    );
                  }}
                />
                <svg
                  className="w-8 h-8 text-emerald-300 mb-2"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 15V7a2 2 0 0 0-2-2h-6"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 9v8a2 2 0 0 0 2 2h14"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-sm text-slate-300">
                  Click to select dataset files — .csv only
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  CSV recommended for data profiling
                </div>
              </div>
            </div>

            {/* Selected files preview */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-300">
                    Selected dataset files
                  </div>
                  <div className="text-xs text-slate-400">
                    {datasetFilesList.length} file(s)
                  </div>
                </div>
                <div className="space-y-2">
                  {datasetFilesList.length === 0 ? (
                    <div className="text-xs text-slate-400">
                      No dataset files chosen.
                    </div>
                  ) : (
                    datasetFilesList.map((f) => (
                      <FileCard
                        key={f.id}
                        f={{
                          ...f,
                          progress:
                            fileAnalysisState.find((p) => p.id === f.id)
                              ?.progress || 0,
                          done:
                            fileAnalysisState.find((p) => p.id === f.id)
                              ?.done || false,
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="flex items-center gap-3">
              <button
                disabled={uploading}
                onClick={handleUpload}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-2 rounded-lg font-semibold shadow"
              >
                {uploading ? "Uploading..." : "Upload"}
                {uploading && (
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={() => {
                  trainingRef.current && (trainingRef.current.value = null);
                  datasetRef.current && (datasetRef.current.value = null);
                  setTrainingFilesList([]);
                  setDatasetFilesList([]);
                  setUploadOutput(null);
                  setFileAnalysisState([]);
                  setUploadedTrainingFiles([]);
                  setUploadedDatasetFiles([]);
                }}
                className="bg-slate-700 px-3 py-2 rounded-lg text-sm"
              >
                Reset
              </button>

              <div className="flex-1">
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all bg-cyan-400"
                    style={{ width: `${uploading ? progress : 0}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {uploading ? statusMessages[statusIndex] : ""}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-slate-400 mb-2">What this does</div>
              <div className="text-sm text-slate-300 bg-slate-900/40 p-3 rounded">
                Upload your training code (.py, .ipynb) and dataset (.csv). The
                UI previews files and runs a quick pipeline animation so users
                know files are being processed.
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-slate-400 mb-2">Upload Output</div>
              <JsonBlock value={uploadOutput} />
            </div>
          </section>

          {/* Analyze + pipeline */}
          <section className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-xl p-6 shadow space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">2) Estimate & Analyze</h2>
                <div className="text-xs text-slate-400 mt-1">
                  Inspect code + data and get back model & data metadata
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-slate-300">
                  Use LLM Fallback
                </label>
                <input
                  type="checkbox"
                  checked={useLLM}
                  onChange={(e) => setUseLLM(e.target.checked)}
                  className="h-4 w-4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm text-slate-300">
                  Source (optional)
                </label>
                <input
                  value={sourceInput}
                  onChange={(e) => setSourceInput(e.target.value)}
                  placeholder="GitHub, HuggingFace, raw .py URL — leave blank to use uploaded files"
                  className="w-full mt-1 p-2 rounded-md bg-slate-900/60 border border-slate-700 text-sm"
                />
              </div>

              <div className="md:col-span-1 flex items-center justify-end gap-3">
                <button
                  disabled={analyzing}
                  onClick={handleAnalyze}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-900 px-4 py-2 rounded-lg font-semibold shadow"
                >
                  {analyzing ? "Analyzing..." : "Estimate & Analyze"}
                </button>
                <button
                  onClick={() => {
                    setAnalyzeOutput(null);
                    setSourceInput("");
                  }}
                  className="bg-slate-700 px-3 py-2 rounded-lg text-sm"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Parsing overlay - shows while analyzing */}
            <ParsingOverlay />

            {/* pipeline */}
            <PipelineVisual />

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-400 mb-2">
                  What this does
                </div>
                <div className="text-sm text-slate-300 bg-slate-900/40 p-3 rounded">
                  Estimate & Analyze inspects training code and dataset to
                  detect framework, preprocessing steps, model params, and data
                  profile. Use a source URL to analyze public repos directly.
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-400 mb-2">
                  Analyze Output
                </div>
                <JsonBlock value={analyzeOutput} />
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500">
                Tip: The top status banner shows friendly messages while
                processing. File cards animate as they are scanned so naive
                users can follow progress visually.
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
