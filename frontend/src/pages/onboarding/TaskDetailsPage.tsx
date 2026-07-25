import { useState } from "react";
import type { ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { onboardingTasks } from "./data/onboardingTasks";
import { getProgress, saveTask } from "./utils/taskStorage";
import { uploadImage } from "../../services/onboarding/uploadService";


function TaskDetailsPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const currentTask = onboardingTasks.find(
        (task) => task.id === Number(id)
    );


    const [uploading, setUploading] = useState(false);

    const [selectedImage, setSelectedImage] =
        useState<string | null>(null);


    const progress = getProgress();

    const completedTask = currentTask
        ? progress[currentTask.id]
        : undefined;


    const [image, setImage] = useState<string>(
        completedTask?.image || ""
    );


    if (!currentTask) {
        return (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-10">
                <h2 className="text-2xl font-semibold text-white">
                    Task not found
                </h2>
            </div>
        );
    }


    const isCompleted =
        completedTask?.completed ?? false;



    async function handleImageChange(
        event: ChangeEvent<HTMLInputElement>
    ) {

        if (!event.target.files?.length) {
            return;
        }


        const file = event.target.files[0];


        try {

            setUploading(true);


            const response = await uploadImage(file);


            setImage(
                response.image_url
            );


        } catch (error) {

            console.error(
                "UPLOAD ERROR:",
                error
            );


            alert(
                "Failed to upload screenshot."
            );


        } finally {

            setUploading(false);

        }
    }



    function handleComplete() {

        if (!image) {

            alert(
                "Please upload a screenshot."
            );

            return;
        }


        saveTask(
            currentTask.id,
            image
        );


        alert(
            "Task marked as completed."
        );


        navigate("/onboarding");
    }



    return (

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-10 shadow-2xl shadow-black/20">


            <Link
                to="/onboarding"
                className="text-violet-400 hover:text-violet-300"
            >
                ← Back to Checklist
            </Link>



            <p className="mt-8 text-sm font-medium uppercase tracking-[0.35em] text-violet-400">
                Onboarding Task
            </p>



            <h1 className="mt-4 text-3xl font-semibold text-white">
                {currentTask.title}
            </h1>



            <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-400">
                {currentTask.description}
            </p>



            <a
                href="https://code.swecha.org/internships/intern-instructions/-/blob/main/workbench-setup.md"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-3 text-sm font-medium text-violet-300 hover:bg-violet-500/20"
            >
                Open Official Workbench Guide
            </a>



            {!isCompleted && (

                <>

                    <div className="mt-8">

                        <label className="mb-2 block text-sm font-medium text-white">
                            Upload Screenshot (Required)
                        </label>


                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={uploading}
                            className="block w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-300"
                        />


                        {uploading && (

                            <p className="mt-3 text-sm text-violet-300">
                                Uploading screenshot...
                            </p>

                        )}

                    </div>



                    {image && (

                        <img
                            src={image}
                            alt="Preview"
                            onClick={() =>
                                setSelectedImage(image)
                            }
                            className="mt-6 max-h-72 cursor-pointer rounded-xl border border-zinc-800"
                        />

                    )}



                    <button
                        onClick={handleComplete}
                        disabled={uploading}
                        className="mt-8 rounded-full bg-violet-600 px-6 py-3 font-medium text-white hover:bg-violet-500 disabled:opacity-50"
                    >
                        Mark as Completed
                    </button>


                </>

            )}




            {isCompleted && (

                <>

                    <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">

                        ✅ This task has been completed.

                    </div>



                    <img
                        src={image}
                        alt="Evidence"
                        onClick={() =>
                            setSelectedImage(image)
                        }
                        className="mt-6 max-h-72 cursor-pointer rounded-xl border border-zinc-800"
                    />


                </>

            )}




            {selectedImage && (

                <div
                    onClick={() =>
                        setSelectedImage(null)
                    }
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                >

                    <img
                        src={selectedImage}
                        alt="Preview"
                        className="max-h-[90vh] max-w-[90vw] rounded-xl"
                    />

                </div>

            )}


        </div>

    );
}


export default TaskDetailsPage;