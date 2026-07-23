export const STORAGE_KEY = "onboarding-progress";

export type CompletedTask = {
    completed: boolean;
    image: string;
};

export function getProgress(): Record<number, CompletedTask> {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return {};
    }

    return JSON.parse(data);
}

export function saveTask(id: number, image: string) {
    const progress = getProgress();

    progress[id] = {
        completed: true,
        image,
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progress)
    );
}