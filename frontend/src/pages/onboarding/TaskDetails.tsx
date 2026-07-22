import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProgress, saveTask } from "./utils/taskStorage";
import { onboardingTasks } from "./data/onboardingTasks";
import "./TaskDetails.css";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const task = useMemo(
    () => onboardingTasks.find((t) => t.id === Number(id)),
    [id]
  );

  if (!task) {
    return (
      <div className="task-details-page">
        <p>Task not found.</p>
        <button onClick={() => navigate("/onboarding")}>
          Back to Onboarding
        </button>
      </div>
    );
  }

  const currentTask = task;

  const progress = getProgress();
  const completedTask = progress[currentTask.id];

  const isCompleted = completedTask?.completed ?? false;

  const [previewUrls, setPreviewUrls] = useState<string[]>(
    completedTask?.images || []
  );

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  async function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }

    const base64Images = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;

            reader.readAsDataURL(file);
          })
      )
    );

    setPreviewUrls(base64Images);
  }

  function handleComplete() {
    if (previewUrls.length === 0) {
      alert("Please upload at least one screenshot.");
      return;
    }

    saveTask(currentTask.id, previewUrls);

    alert("Task marked as completed.");

    navigate("/onboarding");
  }

  return (
    <div className="task-details-page">
      <button
        className="back-btn"
        onClick={() => navigate("/onboarding")}
      >
        &larr; Back
      </button>

      <h1>{currentTask.title}</h1>

      <span
        className={`badge ${isCompleted ? "completed" : "pending"}`}
      >
        {isCompleted ? "Completed" : "Pending"}
      </span>

      <p className="description">{currentTask.description}</p>

      <div className="upload-section">
        <h3>Evidence Upload</h3>
        <p className="hint">
          Upload up to 5 screenshots as proof of completion.
        </p>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        {previewUrls.length > 0 && (
          <div className="preview-grid">
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Evidence ${index + 1}`}
                className={`preview-thumb ${selectedImage === url ? "selected" : ""}`}
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>
        )}

        {selectedImage && (
          <div className="preview-large">
            <img src={selectedImage} alt="Selected preview" />
          </div>
        )}
      </div>

      {!isCompleted && (
        <button className="complete-btn" onClick={handleComplete}>
          Mark as Completed
        </button>
      )}
    </div>
  );
}

export default TaskDetails;